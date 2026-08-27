<?php
declare(strict_types=1);

/*
 * CMS API
 * Public: GET ?section=about|dashboard|services|gallery|contact
 * Admin:  POST JSON { action: "save", section: "...", content: {...} }
 * Upload: POST multipart { action: "upload", scope: "service|gallery", image: File }
 */
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
$allowedOrigins = ["https://sumangalipattucenter.com", "https://www.sumangalipattucenter.com", "http://localhost:5173", "http://127.0.0.1:5173"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if ($origin !== "" && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Vary: Origin");
}
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$isHttps = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off")
    || (($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "") === "https");
session_set_cookie_params(["lifetime" => 0, "path" => "/", "secure" => $isHttps, "httponly" => true, "samesite" => "Lax"]);
session_start();

$databaseFile = __DIR__ . "/../DB/db.php";
if (!is_file($databaseFile)) {
    error_log("CMS API error: database configuration file is missing.");
    respond(500, false, "The service is temporarily unavailable.");
}
require_once $databaseFile;

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $section = validSection($_GET["section"] ?? "");
        $statement = $conn->prepare("SELECT content FROM cms_content WHERE section = ? LIMIT 1");
        $statement->bind_param("s", $section);
        $statement->execute();
        $statement->bind_result($content);
        if (!$statement->fetch()) {
            respond(200, true, "No saved content yet.", ["content" => null]);
        }
        $decoded = json_decode($content, true);
        respond(200, true, "Content loaded.", ["content" => is_array($decoded) ? $decoded : null]);
    }

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        respond(405, false, "Only GET and POST requests are allowed.");
    }
    requireAdmin();

    $isUpload = isset($_POST["action"]) && $_POST["action"] === "upload";
    if ($isUpload) {
        handleUpload();
    }

    $data = json_decode(file_get_contents("php://input") ?: "{}", true);
    if (!is_array($data) || ($data["action"] ?? "") !== "save") {
        respond(400, false, "Invalid request data.");
    }
    $section = validSection($data["section"] ?? "");
    $content = $data["content"] ?? null;
    if (!is_array($content)) {
        respond(422, false, "Content must be an object.");
    }
    validateContent($section, $content);
    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $statement = $conn->prepare("INSERT INTO cms_content (section, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = CURRENT_TIMESTAMP");
    $statement->bind_param("ss", $section, $json);
    $statement->execute();
    respond(200, true, "Content saved successfully.");
} catch (Throwable $exception) {
    error_log("CMS API error: " . $exception->getMessage());
    respond(500, false, "The service is temporarily unavailable.");
}

function requireAdmin(): void {
    $authorization = $_SERVER["HTTP_AUTHORIZATION"] ?? "";
    if (preg_match('/^Bearer\\s+(.+)$/i', $authorization, $matches)) {
        global $conn;
        $hash = hash("sha256", trim($matches[1]));
        $statement = $conn->prepare("SELECT admin_id FROM admin_auth_tokens WHERE token_type = 'access' AND token_hash = ? AND expires_at > NOW() AND revoked_at IS NULL LIMIT 1");
        $statement->bind_param("s", $hash);
        $statement->execute();
        $statement->bind_result($adminId);
        if ($statement->fetch()) return;
    }
    respond(401, false, "Please sign in as an administrator.");
}

function validSection($section): string {
    $allowed = ["about", "dashboard", "services", "gallery", "contact"];
    if (!is_string($section) || !in_array($section, $allowed, true)) {
        respond(422, false, "Invalid content section.");
    }
    return $section;
}

function validateContent(string $section, array $content): void {
    if ($section !== "gallery") return;
    $categories = $content["categories"] ?? null;
    if (!is_array($categories)) respond(422, false, "Gallery categories are required.");
    foreach ($categories as $category) {
        if (!is_array($category) || !isset($category["images"]) || !is_array($category["images"]) || count($category["images"]) > 6) {
            respond(422, false, "Each gallery collection can contain a maximum of 6 photos.");
        }
    }
}

function handleUpload(): void {
    $scope = $_POST["scope"] ?? "";
    if (!in_array($scope, ["service", "gallery", "logo"], true) || !isset($_FILES["image"])) {
        respond(422, false, "Choose a valid image.");
    }
    $file = $_FILES["image"];
    if (($file["error"] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) respond(422, false, "Image upload failed.");
    if (($file["size"] ?? 0) > 10 * 1024 * 1024) respond(422, false, "Image size must be 10 MB or less.");
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);
    $extensions = ["image/jpeg" => "jpg", "image/png" => "png", "image/webp" => "webp", "image/avif" => "avif"];
    if (!isset($extensions[$mime])) respond(422, false, "Only JPG, PNG, WEBP, and AVIF images are allowed.");
    $directory = __DIR__ . "/../uploads/cms";
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) throw new RuntimeException("Unable to create upload directory.");
    $name = $scope . "-" . bin2hex(random_bytes(12)) . "." . $extensions[$mime];
    if (!move_uploaded_file($file["tmp_name"], $directory . "/" . $name)) throw new RuntimeException("Unable to save image.");
    respond(201, true, "Image uploaded.", ["url" => "/uploads/cms/" . $name]);
}

function respond(int $status, bool $success, string $message, array $extra = []): void {
    http_response_code($status);
    echo json_encode(array_merge(["success" => $success, "message" => $message], $extra));
    exit;
}

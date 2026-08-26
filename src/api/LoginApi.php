<?php
declare(strict_types=1);

/*
 * POST /api/LoginApi.php
 * Actions: login, refresh_token, forgot_password, verify_otp, reset_password, logout
 *
 * Required table:
 * CREATE TABLE admin_users (
 *   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 *   email VARCHAR(190) NOT NULL UNIQUE,
 *   password_hash VARCHAR(255) NOT NULL,
 *   is_active TINYINT(1) NOT NULL DEFAULT 1,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

$allowedOrigins = ["https://sumangalipattucenter.com", "https://www.sumangalipattucenter.com", "http://localhost:5173", "http://127.0.0.1:5173"];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if ($origin !== "" && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    respond(405, false, "Only POST requests are allowed.");
}

$isHttps = (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off")
    || (($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? "") === "https");
session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "secure" => $isHttps,
    "httponly" => true,
    "samesite" => "Lax",
]);
session_start();

$databaseFile = __DIR__ . "/../DB/db.php";
if (!is_file($databaseFile)) {
    error_log("Login API error: database configuration file is missing.");
    respond(500, false, "The service is temporarily unavailable.");
}
require_once $databaseFile;

$rawBody = file_get_contents("php://input");
$data = json_decode($rawBody ?: "{}", true);
if (!is_array($data)) {
    respond(400, false, "Invalid request data.");
}

$action = $data["action"] ?? "";

try {
    switch ($action) {
        case "login":
            $email = validEmail($data["email"] ?? "");
            $password = stringValue($data["password"] ?? "");
            if ($email === null || strlen($password) < 8) {
                respond(422, false, "Enter a valid email address and password.");
            }

            $user = findAdmin($conn, $email);
            if (!$user || !password_verify($password, $user["password_hash"])) {
                respond(401, false, "Incorrect email address or password.");
            }

            session_regenerate_id(true);
            unset($_SESSION["password_reset"]);
            $_SESSION["admin_id"] = (int) $user["id"];
            $_SESSION["admin_email"] = $user["email"];
            respond(200, true, "Welcome back.", array_merge(["email" => $user["email"]], issueTokens($conn, (int) $user["id"])));

        case "refresh_token":
            $refreshToken = stringValue($data["refresh_token"] ?? "");
            $userId = validateRefreshToken($conn, $refreshToken);
            if ($userId === null) respond(401, false, "Your sign-in session has expired. Please sign in again.");
            respond(200, true, "Session refreshed.", issueTokens($conn, $userId));

        case "forgot_password":
            $email = validEmail($data["email"] ?? "");
            if ($email === null) {
                respond(422, false, "Enter a valid admin email address.");
            }

            $user = findAdmin($conn, $email);
            /* Always use the same public message so emails cannot be enumerated. */
            if (!$user) {
                respond(200, true, "If that account exists, an OTP has been sent.");
            }

            $otp = (string) random_int(100000, 999999);
            $_SESSION["password_reset"] = [
                "email" => $email,
                "otp_hash" => password_hash($otp, PASSWORD_DEFAULT),
                "expires_at" => time() + 600,
                "attempts" => 0,
                "verified" => false,
            ];

            if (!sendOtpEmail($email, $otp)) {
                unset($_SESSION["password_reset"]);
                respond(500, false, "We could not send the OTP. Please try again shortly.");
            }
            respond(200, true, "A one-time password has been sent to your email.");

        case "verify_otp":
            $email = validEmail($data["email"] ?? "");
            $otp = stringValue($data["otp"] ?? "");
            $reset = $_SESSION["password_reset"] ?? null;
            if ($email === null || !is_array($reset) || ($reset["email"] ?? "") !== $email) {
                respond(400, false, "Request a new OTP before continuing.");
            }
            if (time() > ($reset["expires_at"] ?? 0)) {
                unset($_SESSION["password_reset"]);
                respond(400, false, "This OTP has expired. Please request a new one.");
            }
            if (($reset["attempts"] ?? 0) >= 5) {
                unset($_SESSION["password_reset"]);
                respond(429, false, "Too many attempts. Please request a new OTP.");
            }
            if (!preg_match('/^\\d{6}$/', $otp) || !password_verify($otp, $reset["otp_hash"])) {
                $_SESSION["password_reset"]["attempts"] = ($reset["attempts"] ?? 0) + 1;
                respond(401, false, "That OTP is not correct. Please try again.");
            }

            $_SESSION["password_reset"]["verified"] = true;
            respond(200, true, "OTP verified. Create your new password.");

        case "reset_password":
            $password = stringValue($data["password"] ?? "");
            $reset = $_SESSION["password_reset"] ?? null;
            if (!is_array($reset) || !($reset["verified"] ?? false) || time() > ($reset["expires_at"] ?? 0)) {
                respond(400, false, "Verify a valid OTP before resetting your password.");
            }
            if (strlen($password) < 8) {
                respond(422, false, "Your new password must be at least 8 characters.");
            }

            $hash = password_hash($password, PASSWORD_DEFAULT);
            $statement = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE email = ? AND is_active = 1");
            $statement->bind_param("ss", $hash, $reset["email"]);
            $statement->execute();
            if ($statement->affected_rows !== 1) {
                unset($_SESSION["password_reset"]);
                respond(404, false, "The admin account was not found.");
            }

            unset($_SESSION["password_reset"]);
            session_regenerate_id(true);
            respond(200, true, "Password reset successfully. You can now sign in.");

        case "logout":
            revokeTokens($conn, stringValue($data["access_token"] ?? ""), stringValue($data["refresh_token"] ?? ""));
            $_SESSION = [];
            session_destroy();
            respond(200, true, "You have been signed out.");

        default:
            respond(400, false, "Unknown action.");
    }
} catch (Throwable $exception) {
    error_log("Login API error: " . $exception->getMessage());
    respond(500, false, "The service is temporarily unavailable.");
}

function findAdmin(mysqli $conn, string $email) {
    $statement = $conn->prepare("SELECT id, email, password_hash FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1");
    $statement->bind_param("s", $email);
    $statement->execute();
    $statement->bind_result($id, $adminEmail, $passwordHash);

    if (!$statement->fetch()) {
        return null;
    }

    return [
        "id" => $id,
        "email" => $adminEmail,
        "password_hash" => $passwordHash,
    ];
}

function issueTokens(mysqli $conn, int $userId): array {
    $accessToken = bin2hex(random_bytes(32));
    $refreshToken = bin2hex(random_bytes(48));
    $accessHash = hash("sha256", $accessToken);
    $refreshHash = hash("sha256", $refreshToken);
    $accessExpiry = date("Y-m-d H:i:s", time() + 900); // 15 minutes
    $refreshExpiry = date("Y-m-d H:i:s", time() + 60 * 60 * 24 * 30); // 30 days
    $conn->query("DELETE FROM admin_auth_tokens WHERE expires_at < NOW() OR revoked_at IS NOT NULL");
    $statement = $conn->prepare("INSERT INTO admin_auth_tokens (admin_id, token_type, token_hash, expires_at) VALUES (?, 'access', ?, ?), (?, 'refresh', ?, ?)");
    $statement->bind_param("ississ", $userId, $accessHash, $accessExpiry, $userId, $refreshHash, $refreshExpiry);
    $statement->execute();
    return ["access_token" => $accessToken, "refresh_token" => $refreshToken, "access_expires_in" => 900];
}

function validateRefreshToken(mysqli $conn, string $token): ?int {
    if ($token === "") return null;
    $hash = hash("sha256", $token);
    $statement = $conn->prepare("SELECT admin_id FROM admin_auth_tokens WHERE token_type = 'refresh' AND token_hash = ? AND expires_at > NOW() AND revoked_at IS NULL LIMIT 1");
    $statement->bind_param("s", $hash);
    $statement->execute();
    $statement->bind_result($adminId);
    if (!$statement->fetch()) return null;
    $revoke = $conn->prepare("UPDATE admin_auth_tokens SET revoked_at = NOW() WHERE token_hash = ?");
    $revoke->bind_param("s", $hash);
    $revoke->execute();
    return (int) $adminId;
}

function revokeTokens(mysqli $conn, string $accessToken, string $refreshToken): void {
    $hashes = array_filter([hash("sha256", $accessToken), hash("sha256", $refreshToken)]);
    foreach ($hashes as $hash) {
        $statement = $conn->prepare("UPDATE admin_auth_tokens SET revoked_at = NOW() WHERE token_hash = ?");
        $statement->bind_param("s", $hash);
        $statement->execute();
    }
}

function sendOtpEmail(string $email, string $otp): bool {
    if (!function_exists("mail")) {
        error_log("Login API error: PHP mail() is not available on this server.");
        return false;
    }
    $subject = "Your Sumangali Pattu Center password reset OTP";
    $message = "Hello,\n\nYour password reset OTP is: {$otp}\n\nIt expires in 10 minutes. Do not share this code with anyone.\n\nIf you did not request a password reset, you can ignore this email.";
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "From: Sumangali Pattu Center <no-reply@sumangalipattucenter.com>",
        "Reply-To: no-reply@sumangalipattucenter.com",
    ];
    $sent = mail($email, $subject, $message, implode("\r\n", $headers));
    if (!$sent) {
        error_log("Login API error: OTP email could not be handed to the mail service.");
    }
    return $sent;
}

function validEmail($value) {
    $email = strtolower(trim(stringValue($value)));
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
}

function stringValue($value): string {
    return is_string($value) ? trim($value) : "";
}

function respond(int $status, bool $success, string $message, array $extra = []): void {
    http_response_code($status);
    echo json_encode(array_merge(["success" => $success, "message" => $message], $extra));
    exit;
}

<?php
declare(strict_types=1);

/* Keep these credentials outside the public web root in production when possible. */
$host = "localhost";
$dbname = "u684400783_SumangaliPattu";
$username = "u684400783_SumangaliPattu";
$password = "Sumangali@2026";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $exception) {
    http_response_code(500);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["success" => false, "message" => "The service is temporarily unavailable."]);
    exit;
}
?>

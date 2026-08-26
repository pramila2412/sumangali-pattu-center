<?php
declare(strict_types=1);

/* This utility may be deployed with the API, but it can only run from SSH/CLI. */
if (PHP_SAPI !== "cli") {
    http_response_code(403);
    exit("Forbidden\n");
}

$password = $argv[1] ?? "";
if (strlen($password) < 8) {
    fwrite(STDERR, "Usage: php create-admin.php 'a-password-with-at-least-8-characters'\n");
    exit(1);
}

echo password_hash($password, PASSWORD_DEFAULT) . PHP_EOL;

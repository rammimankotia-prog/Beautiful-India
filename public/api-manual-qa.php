<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$public_file = __DIR__ . '/data/manual-qa.json';
$src_file = dirname(__DIR__) . '/src/data/manual-qa.json';

if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data !== null) {
        $json_str = json_encode($data, JSON_PRETTY_PRINT);
        $public_success = file_put_contents($public_file, $json_str);
        $src_success = true;
        if (file_exists(dirname(__DIR__) . '/src')) {
            $src_success = file_put_contents($src_file, $json_str);
        }
        
        if ($src_success && $public_success) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Manual QA saved successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to save Manual QA"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
    }
}
?>

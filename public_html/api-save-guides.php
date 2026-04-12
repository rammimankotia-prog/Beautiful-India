<?php
/**
 * API: Save Guides
 * -----------------
 * This script accepts a JSON array of articles from the admin dashboard
 * and persists them to the server's data source.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// 0. Diagnostic Ping (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $public_file = __DIR__ . '/data/guides.json';
    $src_file = dirname(__DIR__) . '/src/data/guides.json';
    $data_dir = __DIR__ . '/data';
    $src_data_dir = dirname(__DIR__) . '/src/data';
    
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "online",
        "timestamp" => date('c'),
        "diagnostics" => [
            "public_dir" => is_writable($data_dir) ? "writable" : "locked",
            "public_file" => file_exists($public_file) ? (is_writable($public_file) ? "writable" : "readonly") : "missing",
            "src_dir" => file_exists($src_data_dir) ? (is_writable($src_data_dir) ? "writable" : "locked") : "not_found",
            "php_version" => PHP_VERSION,
            "user" => get_current_user()
        ]
    ]);
    exit;
}


// 1. Define target paths (Environment aware)
$public_file = __DIR__ . '/data/guides.json';
$src_file = dirname(__DIR__) . '/src/data/guides.json';

// Ensure data directories exist
if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Capture and validate inbound JSON 
    $inbound_json = file_get_contents("php://input");
    $payload = json_decode($inbound_json, true);
    
    if ($payload !== null) {
        // Read existing guides
        $target = file_exists($src_file) ? $src_file : $public_file;
        $existing_data = file_exists($target) ? json_decode(file_get_contents($target), true) : [];
        if (!is_array($existing_data)) { $existing_data = []; }

        $final_data = [];

        // MODE A: Full-list Overwrite (Safe Delete Action)
        if (isset($payload['isDeleteAction']) && isset($payload['updatedList'])) {
            $final_data = $payload['updatedList'];
        } 
        // MODE B: Atomic Single Update
        else if (isset($payload['id'])) {
            $found = false;
            foreach ($existing_data as &$guide) {
                if (strval($guide['id']) === strval($payload['id'])) {
                    $guide = array_merge($guide, $payload);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $existing_data[] = $payload;
            }
            $final_data = $existing_data;
        } 
        else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid payload format."]);
            exit;
        }

        // Pretty print for readability
        $formatted_json = json_encode($final_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        $public_success = file_put_contents($public_file, $formatted_json);
        $src_success = true; 
        if (file_exists(dirname(__DIR__) . '/src')) {
            $src_success = file_put_contents($src_file, $formatted_json);
        }
        
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true, 
            "message" => "Sync completed.",
            "final_count" => count($final_data)
        ]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing data."]);
    }
}
 else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 4. GET requests should return the current master source
    $target = file_exists($src_file) ? $src_file : $public_file;
    if (file_exists($target)) {
        header('Content-Type: application/json');
        echo file_get_contents($target);
    } else {
        echo json_encode([]);
    }
} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Method not allowed. Use POST to save or GET to retrieve."]);
}
?>

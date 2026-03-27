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

// 1. Define target paths (Environment aware)
$public_file = __DIR__ . '/data/guides.json';
$src_file = dirname(__DIR__) . '/src/data/guides.json';

// Ensure data directories exist
if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Capture and validate inbound JSON
    $inbound_json = file_get_contents("php://input");
    $data = json_decode($inbound_json, true);
    
    if ($data !== null) {
        // Pretty print for readability
        $formatted_json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        // 3. Persist to BOTH locations if locally in dev, or just public if in live
        $public_success = file_put_contents($public_file, $formatted_json);
        $src_success = true; // Default to true if src doesn't exist (live)
        
        if (file_exists(dirname(__DIR__) . '/src')) {
            $src_success = file_put_contents($src_file, $formatted_json);
        }
        
        if ($src_success !== false && $public_success !== false) {
            header('Content-Type: application/json');
            echo json_encode([
                "success" => true, 
                "message" => "Guides successfully synchronized to server.",
                "count" => count($data)
            ]);
        } else {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                "success" => false, 
                "message" => "Server file write error. Check permissions on /src/data and /public/data."
            ]);
        }
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Invalid JSON payload provided."]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

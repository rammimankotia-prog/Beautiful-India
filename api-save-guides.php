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

// 1. Define target paths
$src_file = __DIR__ . '/src/data/guides.json';
$public_file = __DIR__ . '/public/data/guides.json';

// Ensure data directories exist
if (!file_exists(__DIR__ . '/src/data')) { mkdir(__DIR__ . '/src/data', 0777, true); }
if (!file_exists(__DIR__ . '/public/data')) { mkdir(__DIR__ . '/public/data', 0777, true); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 2. Capture and validate inbound JSON
    $inbound_json = file_get_contents("php://input");
    $data = json_decode($inbound_json, true);
    
    if ($data !== null) {
        // Pretty print for readability
        $formatted_json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        // 3. Persist to BOTH locations (source and public)
        $src_success = file_put_contents($src_file, $formatted_json);
        $public_success = file_put_contents($public_file, $formatted_json);
        
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
    if (file_exists($src_file)) {
        header('Content-Type: application/json');
        echo file_get_contents($src_file);
    } else {
        echo json_encode([]);
    }
} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Method not allowed. Use POST to save or GET to retrieve."]);
}
?>

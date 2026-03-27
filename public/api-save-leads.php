<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// 1. Define target paths (Environment aware)
$public_file = __DIR__ . '/data/leads.json';
$src_file = dirname(__DIR__) . '/src/data/leads.json';

// Ensure data directories exist
if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

// Ensure directory exists
// Ensure file exists with an empty array if it doesn't
if (!file_exists($public_file)) {
    file_put_contents($public_file, json_encode([], JSON_PRETTY_PRINT));
}
if (file_exists(dirname(__DIR__) . '/src') && !file_exists($src_file)) {
    file_put_contents($src_file, json_encode([], JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $json = file_exists($target) ? file_get_contents($target) : '[]';
        $current_data = json_decode($json, true) ?: [];
        
        // Add ID and Timestamp if not present
        if (!isset($data['id'])) {
            $data['id'] = 'LD-' . time() . '-' . rand(1000, 9999);
        }
        if (!isset($data['timestamp']) && !isset($data['createdAt'])) {
            $data['createdAt'] = date('c');
        }
        if (!isset($data['status'])) {
            $data['status'] = 'New';
        }
        
        // 3. Persist to BOTH locations
        $public_success = file_put_contents($public_file, json_encode($current_data, JSON_PRETTY_PRINT));
        $src_success = true;
        if (file_exists(dirname(__DIR__) . '/src')) {
            $src_success = file_put_contents($src_file, json_encode($current_data, JSON_PRETTY_PRINT));
        }
        
        if ($src_success && $public_success) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Inquiry saved successfully", "lead" => $data]);
        } else {
            $err = error_get_last();
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(["success" => false, "message" => "Failed to save data: " . $err['message']]);
        }
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
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
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $file = __DIR__ . '/src/data/train_queries.json';
        $dir = __DIR__ . '/src/data';
        
        // Ensure directory exists
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        
        $current_data = [];
        if (file_exists($file)) {
            $json = file_get_contents($file);
            $current_data = json_decode($json, true) ?: [];
        }
        
        // Add ID and Timestamp if not present
        if (!isset($data['id'])) {
            $data['id'] = 'TQ-' . time() . '-' . rand(1000, 9999);
        }
        if (!isset($data['timestamp'])) {
            $data['timestamp'] = date('c');
        }
        if (!isset($data['status'])) {
            $data['status'] = 'New';
        }
        
        $current_data[] = $data;
        
        if (file_put_contents($file, json_encode($current_data, JSON_PRETTY_PRINT))) {
            echo json_encode(["success" => true, "message" => "Train query saved successfully"]);
        } else {
            $err = error_get_last();
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to save data: " . $err['message']]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>

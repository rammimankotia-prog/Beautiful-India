<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$file = __DIR__ . '/src/data/leads.json';
$dir = __DIR__ . '/src/data';

// Ensure directory exists
if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
}

// Ensure file exists with an empty array if it doesn't
if (!file_exists($file)) {
    file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $json = file_get_contents($file);
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
        
        // Push the new lead to the beginning of the array
        array_unshift($current_data, $data);
        
        if (file_put_contents($file, json_encode($current_data, JSON_PRETTY_PRINT))) {
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
    // Optional: Allow getting leads for the admin dashboard via the same API
    if (file_exists($file)) {
        header('Content-Type: application/json');
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>

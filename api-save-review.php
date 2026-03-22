<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$file = __DIR__ . '/src/data/reviews.json';
$dir = __DIR__ . '/src/data';

// Ensure directory exists
if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
}

// Ensure file exists with an empty array if it doesn't
if (!file_exists($file)) {
    file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $json = file_get_contents($file);
    header('Content-Type: application/json');
    echo $json;
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $json = file_get_contents($file);
        $current_data = json_decode($json, true) ?: [];
        
        // Ensure required fields are present; if missing, generate defaults
        if (!isset($data['id'])) {
            $data['id'] = 'REV-' . time() . '-' . rand(1000, 9999);
        }
        if (!isset($data['createdAt'])) {
            $data['createdAt'] = date('c');
        }
        
        // Add new review to the beginning of the list
        array_unshift($current_data, $data);
        
        if (file_put_contents($file, json_encode($current_data, JSON_PRETTY_PRINT))) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Review saved successfully", "review" => $data]);
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
} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>

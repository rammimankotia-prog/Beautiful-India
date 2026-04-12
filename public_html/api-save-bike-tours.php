<?php
// PHP Fallback for Bike Tours
// Place this at: /api-save-bike-tours.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data received: ' . json_last_error_msg());
    }

    $srcPath = __DIR__ . '/data/bike-tours.json';
    
    if (!file_exists(dirname($srcPath))) {
        mkdir(dirname($srcPath), 0777, true);
    }

    $jsonStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($srcPath, $jsonStr, LOCK_EX) === false) {
        throw new Exception('Failed to write to bike-tours.json. Check folder permissions.');
    }

    echo json_encode(['success' => true, 'message' => 'Bike Tours saved successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

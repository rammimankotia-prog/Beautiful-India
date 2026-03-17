<?php
// PHP Fallback for Hostinger Shared Hosting (No Node.js Support)
// Place this at: /api/save-tours.php

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
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Adjust paths based on your installation directory
    // Inside 'dist', data is usually in 'data/tours.json'
    $srcPath = __DIR__ . '/../src/data/tours.json';
    
    // In production (dist), the folder structure might be different
    if (!file_exists(dirname($srcPath))) {
        mkdir(dirname($srcPath), 0777, true);
    }

    $jsonStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($srcPath, $jsonStr) === false) {
        throw new Exception('Failed to write to tours.json. Check folder permissions.');
    }

    echo json_encode(['success' => true, 'message' => 'Tours saved via PHP fallback']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

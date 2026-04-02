<?php
// PHP Backend for Pilgrimage Custom Post Type Operations
// Placed at: /api-save-pk-pilgrimages.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data received.');
    }

    // Isolate sandboxed file path
    $srcPath = __DIR__ . '/data/pk_pilgrimage_tours.json';
    
    if (!file_exists(dirname($srcPath))) {
        mkdir(dirname($srcPath), 0777, true);
    }

    $jsonStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($srcPath, $jsonStr, LOCK_EX) === false) {
        throw new Exception('Failed to write to pk_pilgrimage_tours.json. Check folder permissions.');
    }

    echo json_encode(['success' => true, 'message' => 'Pilgrimage directory updated successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

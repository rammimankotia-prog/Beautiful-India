<?php
// PHP Fallback for Hostinger Shared Hosting (No Node.js Support)
// Place this at: /api/save-categories.php

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

    // 1. Define target paths (Environment aware)
    $public_file = __DIR__ . '/data/categories.json';
    $src_file = dirname(__DIR__) . '/src/data/categories.json';

    // Ensure data directories exist
    if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
    if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

    $target = file_exists($src_file) ? $src_file : $public_file;
    
    // Ensure we preserve meta and presets
    $currentObj = ['meta' => [], 'presets' => []];
    if (file_exists($target)) {
        $currentObj = json_decode(file_get_contents($target), true);
    }

    $finalData = [
        'categories' => $data,
        'meta' => isset($currentObj['meta']) ? $currentObj['meta'] : [],
        'presets' => isset($currentObj['presets']) ? $currentObj['presets'] : []
    ];

    $jsonStr = json_encode($finalData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    // 3. Persist to BOTH locations
    $public_success = file_put_contents($public_file, $jsonStr);
    $src_success = true;
    if (file_exists(dirname(__DIR__) . '/src')) {
        $src_success = file_put_contents($src_file, $jsonStr);
    }
    
    if ($src_success === false || $public_success === false) {
        throw new Exception('Failed to write to data files. Check permissions.');
    }

    echo json_encode(['success' => true, 'message' => 'Categories saved via PHP fallback']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

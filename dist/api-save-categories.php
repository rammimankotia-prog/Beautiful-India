<?php
// PHP Fallback for Hostinger Shared Hosting (No Node.js Support)
// Place this at: /api/save-categories.php or similar

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
    $srcPath = __DIR__ . '/../src/data/categories.json';
    
    // Ensure we preserve meta and presets
    $currentObj = ['meta' => [], 'presets' => []];
    if (file_exists($srcPath)) {
        $currentObj = json_decode(file_get_contents($srcPath), true);
    }

    $finalData = [
        'categories' => $data,
        'meta' => isset($currentObj['meta']) ? $currentObj['meta'] : [],
        'presets' => isset($currentObj['presets']) ? $currentObj['presets'] : []
    ];

    $jsonStr = json_encode($finalData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($srcPath, $jsonStr) === false) {
        throw new Exception('Failed to write to categories.json. Check folder permissions.');
    }

    echo json_encode(['success' => true, 'message' => 'Categories saved via PHP fallback']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

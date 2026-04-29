<?php
// api-vehicles.php - Comprehensive CRUD for Transport Fleet
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$public_file = __DIR__ . '/data/transport-vehicles.json';
$src_file = __DIR__ . '/src/data/transport-vehicles.json';

// Ensure data directory exists
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0777, true);
}

// 1. GET - Fetch all vehicles
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $target = file_exists($src_file) ? $src_file : $public_file;
    if (file_exists($target)) {
        header('Content-Type: application/json');
        echo file_get_contents($target);
    } else {
        echo json_encode([]);
    }
    exit;
}

// 2. DELETE (or POST with action=delete)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
    }

    if ($id) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $json = file_exists($target) ? file_get_contents($target) : '[]';
        $current_data = json_decode($json, true) ?: [];
        
        $new_data = array_filter($current_data, function($v) use ($id) {
            return strval($v['id'] ?? '') !== strval($id);
        });
        
        if (count($new_data) < count($current_data)) {
            $new_data = array_values($new_data);
            file_put_contents($public_file, json_encode($new_data, JSON_PRETTY_PRINT));
            if (file_exists(__DIR__ . '/src')) {
                file_put_contents($src_file, json_encode($new_data, JSON_PRETTY_PRINT));
            }
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Vehicle removed"]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Vehicle not found"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID required"]);
    }
    exit;
}

// 3. POST - Create or Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $newData = json_decode($json, true);

    if (!$newData) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit;
    }

    $target = file_exists($src_file) ? $src_file : $public_file;
    $existingJson = file_exists($target) ? file_get_contents($target) : '[]';
    $existingData = json_decode($existingJson, true) ?: [];

    // If it's a single object (Add/Edit)
    if (isset($newData['id'])) {
        $found = false;
        foreach ($existingData as &$v) {
            if (strval($v['id']) === strval($newData['id'])) {
                $v = $newData;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $existingData[] = $newData;
        }
    } else {
        // Bulk save
        $existingData = $newData;
    }

    file_put_contents($public_file, json_encode($existingData, JSON_PRETTY_PRINT));
    if (file_exists(__DIR__ . '/src')) {
        file_put_contents($src_file, json_encode($existingData, JSON_PRETTY_PRINT));
    }

    header('Content-Type: application/json');
    echo json_encode(["success" => true, "message" => "Fleet updated"]);
    exit;
}
?>

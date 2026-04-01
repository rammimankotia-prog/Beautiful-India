<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// 1. Define target paths (Environment aware)
$public_file = __DIR__ . '/data/train_queries.json';
$src_file = dirname(__DIR__) . '/src/data/train_queries.json';

// Ensure data directories exist
if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(dirname(__DIR__) . '/src')) { mkdir(dirname($src_file), 0777, true); }

// Ensure file exists with an empty array if it doesn't
if (!file_exists($public_file)) {
    file_put_contents($public_file, json_encode([], JSON_PRETTY_PRINT));
}
if (file_exists(dirname(__DIR__) . '/src') && !file_exists($src_file)) {
    file_put_contents($src_file, json_encode([], JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $target = file_exists($src_file) ? $src_file : $public_file;
    $json = file_exists($target) ? file_get_contents($target) : '[]';
    header('Content-Type: application/json');
    echo $json;
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $json = file_exists($target) ? file_get_contents($target) : '[]';
        $current_data = json_decode($json, true) ?: [];
        
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
        
        // 3. Persist to BOTH locations
        $public_success = file_put_contents($public_file, json_encode($current_data, JSON_PRETTY_PRINT));
        $src_success = true;
        if (file_exists(dirname(__DIR__) . '/src')) {
            $src_success = file_put_contents($src_file, json_encode($current_data, JSON_PRETTY_PRINT));
        }
        
        if ($src_success && $public_success) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Train query saved successfully", "query" => $data]);
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
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id']) && isset($data['status'])) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $json = file_exists($target) ? file_get_contents($target) : '[]';
        $current_data = json_decode($json, true) ?: [];
        
        $updated = false;
        foreach ($current_data as &$q) {
            if ($q['id'] === $data['id']) {
                $q['status'] = $data['status'];
                $updated = true;
                break;
            }
        }
        
        if ($updated) {
            file_put_contents($public_file, json_encode($current_data, JSON_PRETTY_PRINT));
            if (file_exists(dirname(__DIR__) . '/src')) {
                file_put_contents($src_file, json_encode($current_data, JSON_PRETTY_PRINT));
            }
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Status updated"]);
        } else {
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(["success" => false, "message" => "Query not found"]);
        }
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "ID and status required"]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
    }

    if ($id) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $json = file_exists($target) ? file_get_contents($target) : '[]';
        $current_data = json_decode($json, true) ?: [];
        
        $new_data = array_filter($current_data, function($q) use ($id) {
            return $q['id'] !== $id;
        });
        
        if (count($new_data) < count($current_data)) {
            $new_data = array_values($new_data);
            file_put_contents($public_file, json_encode($new_data, JSON_PRETTY_PRINT));
            if (file_exists(dirname(__DIR__) . '/src')) {
                file_put_contents($src_file, json_encode($new_data, JSON_PRETTY_PRINT));
            }
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Query deleted"]);
        } else {
            http_response_code(404);
            header('Content-Type: application/json');
            echo json_encode(["success" => false, "message" => "Query not found"]);
        }
    } else {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "ID required for deletion"]);
    }
    exit;
}

http_response_code(405);
header('Content-Type: application/json');
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>

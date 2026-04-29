<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$public_file = __DIR__ . '/data/bookings.json';
$src_file = __DIR__ . '/src/data/bookings.json';

if (!file_exists(dirname($public_file))) { mkdir(dirname($public_file), 0777, true); }
if (!file_exists(dirname($src_file)) && file_exists(__DIR__ . '/src')) { mkdir(dirname($src_file), 0777, true); }

if (!file_exists($public_file)) { file_put_contents($public_file, json_encode([], JSON_PRETTY_PRINT)); }
if (file_exists(__DIR__ . '/src') && !file_exists($src_file)) { file_put_contents($src_file, json_encode([], JSON_PRETTY_PRINT)); }

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $id = $_GET['id'] ?? null;
    if (!$id && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $postData = json_decode(file_get_contents("php://input"), true);
        $id = $postData['id'] ?? null;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID required"]);
        exit;
    }

    $target = file_exists($src_file) ? $src_file : $public_file;
    $current_data = json_decode(file_get_contents($target), true) ?: [];
    
    $new_data = array_values(array_filter($current_data, function($item) use ($id) {
        return strval($item['id'] ?? '') !== strval($id);
    }));
    
    file_put_contents($public_file, json_encode($new_data, JSON_PRETTY_PRINT));
    if (file_exists(__DIR__ . '/src')) {
        file_put_contents($src_file, json_encode($new_data, JSON_PRETTY_PRINT));
    }
    
    header('Content-Type: application/json');
    echo json_encode(["success" => true, "message" => "Booking deleted successfully"]);
    exit;
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data) {
        $target = file_exists($src_file) ? $src_file : $public_file;
        $current_data = json_decode(file_get_contents($target), true) ?: [];
        
        if (is_array($data) && isset($data[0])) {
            // Overwrite if array (bulk sync)
            $current_data = $data;
        } else {
            // Append if single object
            if (!isset($data['id'])) $data['id'] = 'BK-' . time();
            array_unshift($current_data, $data);
        }
        
        file_put_contents($public_file, json_encode($current_data, JSON_PRETTY_PRINT));
        if (file_exists(__DIR__ . '/src')) {
            file_put_contents($src_file, json_encode($current_data, JSON_PRETTY_PRINT));
        }
        echo json_encode(["success" => true]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $target = file_exists($src_file) ? $src_file : $public_file;
    header('Content-Type: application/json');
    echo file_get_contents($target);
}
?>

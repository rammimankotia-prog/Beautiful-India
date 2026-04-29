<?php
/**
 * MASTER VEHICLES API - api-vehicles.php
 * Handles: GET (list all), POST (save/update), DELETE (remove by id)
 * Routes: /api/vehicles (via .htaccess)
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$public_data_dir = __DIR__ . '/data';
$src_data_dir    = dirname(__DIR__) . '/src/data';
$public_file     = $public_data_dir . '/transport-vehicles.json';
$src_file        = $src_data_dir . '/transport-vehicles.json';

// Ensure directories exist
if (!is_dir($public_data_dir)) { mkdir($public_data_dir, 0777, true); }
if (!is_dir($src_data_dir))    { mkdir($src_data_dir, 0777, true); }

// Ensure files exist
if (!file_exists($public_file)) { file_put_contents($public_file, '[]'); }
if (!file_exists($src_file))    { file_put_contents($src_file, '[]'); }

function readVehicles($public_file, $src_file) {
    $target = file_exists($src_file) ? $src_file : $public_file;
    $json   = @file_get_contents($target);
    $data   = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function writeVehicles($vehicles, $public_file, $src_file) {
    $json = json_encode(array_values($vehicles), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $ok1  = file_put_contents($public_file, $json, LOCK_EX);
    $ok2  = file_put_contents($src_file,    $json, LOCK_EX);
    return ($ok1 !== false && $ok2 !== false);
}

// 1. GET - Fetch all vehicles
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $vehicles = readVehicles($public_file, $src_file);
    echo json_encode($vehicles);
    exit;
}

// 2. DELETE (or POST with action=delete)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $body = json_decode(file_get_contents("php://input"), true);
        $id   = $body['id'] ?? null;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Vehicle ID is required"]);
        exit;
    }

    $vehicles = readVehicles($public_file, $src_file);
    $before   = count($vehicles);
    $vehicles = array_filter($vehicles, fn($v) => strval($v['id'] ?? '') !== strval($id));
    $after    = count($vehicles);

    if ($before === $after) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Vehicle not found"]);
        exit;
    }

    if (writeVehicles($vehicles, $public_file, $src_file)) {
        echo json_encode(["success" => true, "message" => "Vehicle removed"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to save after deletion"]);
    }
    exit;
}

// 3. POST - Create or Update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw  = file_get_contents("php://input");
    $newData = json_decode($raw, true);

    if (!$newData || !is_array($newData)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
        exit;
    }

    $existingData = readVehicles($public_file, $src_file);

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
        // bulk replace (not standard, but implemented in original file)
        $existingData = $newData;
    }

    if (writeVehicles($existingData, $public_file, $src_file)) {
        echo json_encode(["success" => true, "message" => "Fleet updated"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to write fleet data"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);

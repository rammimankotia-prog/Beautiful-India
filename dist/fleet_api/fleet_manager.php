<?php
/**
 * Fleet Manager API — CRUD for Transport Vehicles
 * File location on server: /public_html/fleet_api/fleet_manager.php
 * Data saved to:          /public_html/data/transport-vehicles.json
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// __DIR__ = .../public_html/fleet_api
// dirname(__DIR__) = .../public_html  ← document root
$data_dir  = dirname(__DIR__) . '/data';
$data_file = $data_dir . '/transport-vehicles.json';

// Ensure data directory exists and is writable
if (!is_dir($data_dir)) { @mkdir($data_dir, 0755, true); }
if (!file_exists($data_file)) { file_put_contents($data_file, '[]'); }

// ── Helpers ───────────────────────────────────────────────────────────────────
function readVehicles($f) {
    $json = @file_get_contents($f);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function writeVehicles($vehicles, $f) {
    return file_put_contents($f, json_encode(array_values($vehicles), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

// ── GET ───────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(readVehicles($data_file));
    exit;
}

// ── DELETE (or POST?action=delete) ────────────────────────────────────────────
$isDelete = $_SERVER['REQUEST_METHOD'] === 'DELETE'
         || ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_GET['action'] ?? '') === 'delete');

if ($isDelete) {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $body = json_decode(file_get_contents('php://input'), true);
        $id   = $body['id'] ?? null;
    }
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }
    $vehicles = readVehicles($data_file);
    $before   = count($vehicles);
    $vehicles = array_filter($vehicles, fn($v) => strval($v['id'] ?? '') !== strval($id));
    if (count($vehicles) === $before) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Vehicle not found']);
        exit;
    }
    writeVehicles($vehicles, $data_file)
        ? print(json_encode(['success' => true, 'message' => 'Vehicle removed']))
        : (http_response_code(500) && print(json_encode(['success' => false, 'message' => 'Write failed'])));
    exit;
}

// ── POST (save/update) ────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw     = file_get_contents('php://input');
    $newData = json_decode($raw, true);

    if (!$newData || !is_array($newData)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
        exit;
    }

    $existing = readVehicles($data_file);

    if (isset($newData['id'])) {
        $found = false;
        foreach ($existing as &$v) {
            if (strval($v['id']) === strval($newData['id'])) {
                $v     = $newData;
                $found = true;
                break;
            }
        }
        if (!$found) { $existing[] = $newData; }
    } else {
        // Bulk replace
        $existing = $newData;
    }

    if (writeVehicles($existing, $data_file)) {
        echo json_encode(['success' => true, 'message' => 'Fleet updated']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to write data file. Check folder permissions.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

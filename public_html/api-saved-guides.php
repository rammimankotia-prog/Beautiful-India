<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$data_dir  = __DIR__ . '/data';
$data_file = $data_dir . '/saved_guides.json';

// Ensure the data directory and file exist
if (!file_exists($data_dir)) {
    mkdir($data_dir, 0777, true);
}
if (!file_exists($data_file)) {
    file_put_contents($data_file, json_encode([], JSON_PRETTY_PRINT));
}

/**
 * Load and sanitise the store.
 * Structure: { "deviceId": ["slug1", "slug2", ...], ... }
 */
function loadStore($file) {
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function saveStore($file, $store) {
    return file_put_contents($file, json_encode($store, JSON_PRETTY_PRINT)) !== false;
}

function jsonOk($payload) {
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function jsonError($msg, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => $msg]);
    exit;
}

// ── GET: return all saved slugs for a deviceId ──────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $deviceId = trim($_GET['deviceId'] ?? '');
    if (!$deviceId) jsonError('deviceId is required');

    $store = loadStore($data_file);
    $saved = $store[$deviceId] ?? [];
    jsonOk(["success" => true, "saved" => array_values($saved)]);
}

// ── POST: toggle a guide bookmark ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents("php://input"), true);
    $deviceId = trim($body['deviceId'] ?? '');
    $slug     = trim($body['slug']     ?? '');
    $action   = trim($body['action']   ?? ''); // "save" | "remove"

    if (!$deviceId || !$slug || !in_array($action, ['save', 'remove'])) {
        jsonError('deviceId, slug, and action (save|remove) are required');
    }

    // Sanitise inputs
    $deviceId = preg_replace('/[^a-zA-Z0-9\-_]/', '', $deviceId);
    $slug     = preg_replace('/[^a-zA-Z0-9\-_]/', '', $slug);

    $store = loadStore($data_file);
    $list  = $store[$deviceId] ?? [];

    if ($action === 'save') {
        if (!in_array($slug, $list)) {
            $list[] = $slug;
        }
        $message = 'Guide saved';
    } else {
        $list    = array_filter($list, fn($s) => $s !== $slug);
        $message = 'Guide removed';
    }

    $store[$deviceId] = array_values($list);
    $ok = saveStore($data_file, $store);

    if ($ok) {
        jsonOk(["success" => true, "message" => $message, "saved" => $store[$deviceId]]);
    } else {
        jsonError('Failed to write data', 500);
    }
}

http_response_code(405);
jsonError('Method not allowed', 405);
?>

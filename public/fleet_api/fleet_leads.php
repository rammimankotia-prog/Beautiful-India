<?php
/**
 * Fleet Leads API — CRUD for Transport Inquiries
 * File location on server: /public_html/fleet_api/fleet_leads.php
 * Data saved to:          /public_html/data/leads.json
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// __DIR__ = .../public_html/fleet_api
// dirname(__DIR__) = .../public_html  ← document root
$data_dir  = dirname(__DIR__) . '/data';
$data_file = $data_dir . '/leads.json';

// Ensure data directory + file exist
if (!is_dir($data_dir))       { @mkdir($data_dir, 0755, true); }
if (!file_exists($data_file)) { file_put_contents($data_file, '[]'); }

// ── Helpers ────────────────────────────────────────────────────────────────────
function readLeads($f) {
    $json = @file_get_contents($f);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function writeLeads($leads, $f) {
    return file_put_contents($f, json_encode(array_values($leads), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

// ── GET ────────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $leads = readLeads($data_file);
    usort($leads, fn($a, $b) => strcmp($b['createdAt'] ?? $b['timestamp'] ?? '', $a['createdAt'] ?? $a['timestamp'] ?? ''));
    echo json_encode($leads);
    exit;
}

// ── DELETE (or POST?action=delete) ─────────────────────────────────────────────
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
    $leads  = readLeads($data_file);
    $before = count($leads);
    $leads  = array_filter($leads, fn($l) => strval($l['id'] ?? '') !== strval($id));
    if (count($leads) === $before) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Lead not found']);
        exit;
    }
    writeLeads($leads, $data_file)
        ? print(json_encode(['success' => true, 'message' => 'Lead deleted']))
        : (http_response_code(500) && print(json_encode(['success' => false, 'message' => 'Write failed'])));
    exit;
}

// ── POST (save / update) ───────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
        exit;
    }

    if (empty($data['id'])) {
        $data['id'] = 'LD-' . time() . '-' . rand(1000, 9999);
    }
    if (empty($data['createdAt']) && empty($data['timestamp'])) {
        $data['createdAt'] = date('c');
    }
    if (empty($data['status'])) { $data['status'] = 'New'; }

    $leads   = readLeads($data_file);
    $updated = false;
    foreach ($leads as &$l) {
        if (($l['id'] ?? '') === $data['id']) {
            $data['createdAt'] = $l['createdAt'] ?? $l['timestamp'] ?? date('c');
            $l = array_merge($l, $data);
            $updated = true;
            break;
        }
    }
    if (!$updated) { $leads[] = $data; }

    if (writeLeads($leads, $data_file)) {
        echo json_encode(['success' => true, 'message' => 'Lead saved', 'id' => $data['id'], 'lead' => $data]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to write leads file. Check directory permissions.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

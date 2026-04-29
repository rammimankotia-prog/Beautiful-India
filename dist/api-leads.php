<?php
/**
 * MASTER LEADS API - api-leads.php
 * Handles: GET (list all), POST (save/update), DELETE (remove by id)
 * Routes: /api/leads (via .htaccess)
 */

// ── CORS & Headers ─────────────────────────────────────────────────────────
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── File Paths (dual-write: public/data + src/data) ────────────────────────
$public_data_dir = __DIR__ . '/data';
$src_data_dir    = dirname(__DIR__) . '/src/data';
$public_file     = $public_data_dir . '/leads.json';
$src_file        = $src_data_dir . '/leads.json';

// Ensure directories exist
if (!is_dir($public_data_dir)) { mkdir($public_data_dir, 0777, true); }
if (!is_dir($src_data_dir))    { mkdir($src_data_dir, 0777, true); }

// Ensure files exist
if (!file_exists($public_file)) { file_put_contents($public_file, '[]'); }
if (!file_exists($src_file))    { file_put_contents($src_file, '[]'); }

// ── Helper: Read leads ──────────────────────────────────────────────────────
function readLeads($public_file, $src_file) {
    // Prefer src/data (dev environment), fall back to public/data
    $target = file_exists($src_file) ? $src_file : $public_file;
    $json   = @file_get_contents($target);
    $data   = json_decode($json, true);
    return is_array($data) ? $data : [];
}

// ── Helper: Write leads (dual-write) ───────────────────────────────────────
function writeLeads($leads, $public_file, $src_file) {
    $json = json_encode(array_values($leads), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $ok1  = file_put_contents($public_file, $json, LOCK_EX);
    $ok2  = file_put_contents($src_file,    $json, LOCK_EX);
    return ($ok1 !== false && $ok2 !== false);
}

// ── GET: Return all leads ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $leads = readLeads($public_file, $src_file);
    // Sort newest first
    usort($leads, function($a, $b) {
        $ta = $a['createdAt'] ?? $a['timestamp'] ?? '';
        $tb = $b['createdAt'] ?? $b['timestamp'] ?? '';
        return strcmp($tb, $ta);
    });
    echo json_encode($leads);
    exit;
}

// ── POST: Save or update a lead ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw  = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
        exit;
    }

    $leads = readLeads($public_file, $src_file);

    // Normalize the incoming lead
    if (empty($data['id'])) {
        $data['id'] = 'LD-' . time() . '-' . rand(1000, 9999);
    }
    if (empty($data['createdAt']) && empty($data['timestamp'])) {
        $data['createdAt'] = date('c');
    }
    if (empty($data['status'])) {
        $data['status'] = 'New';
    }
    // Ensure source is always tracked
    if (empty($data['source'])) {
        $data['source'] = 'Unknown';
    }

    // Check if it's an update
    $updated = false;
    foreach ($leads as $i => $existing) {
        if (isset($existing['id']) && $existing['id'] === $data['id']) {
            // Preserve original createdAt
            $data['createdAt'] = $existing['createdAt'] ?? $existing['timestamp'] ?? date('c');
            $leads[$i] = array_merge($existing, $data);
            $updated = true;
            break;
        }
    }
    if (!$updated) {
        $leads[] = $data;
    }

    if (writeLeads($leads, $public_file, $src_file)) {
        echo json_encode(["success" => true, "message" => "Lead saved successfully", "id" => $data['id'], "lead" => $data]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to write leads file. Check directory permissions."]);
    }
    exit;
}

// ── DELETE: Remove a lead by id ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Support both query param (?id=xxx) and JSON body
    $id = $_GET['id'] ?? '';
    if (!$id) {
        $body = json_decode(file_get_contents("php://input"), true);
        $id   = $body['id'] ?? '';
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Lead ID is required for deletion"]);
        exit;
    }

    $leads  = readLeads($public_file, $src_file);
    $before = count($leads);
    $leads  = array_filter($leads, fn($l) => ($l['id'] ?? '') !== $id);
    $after  = count($leads);

    if ($before === $after) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Lead with ID '$id' not found"]);
        exit;
    }

    if (writeLeads($leads, $public_file, $src_file)) {
        echo json_encode(["success" => true, "message" => "Lead deleted successfully", "deleted_id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to save after deletion"]);
    }
    exit;
}

// ── Method Not Allowed ───────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);

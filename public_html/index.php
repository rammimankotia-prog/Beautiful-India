<?php
/**
 * Single Entry Point for Beautiful India
 * Handles both React SPA routing and backend API requests.
 */

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// 1. API Routing
if (strpos($uri, '/api/') === 0 || strpos($uri, '/fleet_api/') === 0) {
    // Basic routing for transport module
    if (strpos($uri, 'vehicles') !== false || strpos($uri, 'fleet_manager') !== false) {
        require_once __DIR__ . '/fleet_api/fleet_manager.php';
        exit;
    }
    if (strpos($uri, 'leads') !== false || strpos($uri, 'fleet_leads') !== false) {
        require_once __DIR__ . '/fleet_api/fleet_leads.php';
        exit;
    }
    if (strpos($uri, 'upload') !== false) {
        require_once __DIR__ . '/api-upload.php';
        exit;
    }
    
    // Fallback for unknown API calls
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'API endpoint not found in router']);
    exit;
}

// 2. SPA Fallback
// If it's a physical file (image, css, js), let the server handle it (usually via .htaccess or direct access)
// But for anything else, serve the React App
require_once __DIR__ . '/app.php';
?>

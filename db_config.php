<?php
// Database Configuration for Bharat Darshan
// This file connects to MySQL database for future use
// Currently using JSON-based storage for tours and inquiries

define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'bharat_darshan');

$conn = false;

function get_db_connection() {
    global $conn;
    if ($conn) return $conn;
    
    $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if (!$conn) {
        error_log("Database connection failed: " . mysqli_connect_error());
        return false;
    }
    return $conn;
}

// Check if database connection should be used
$USE_DATABASE = false; // Set to true when MySQL is configured

if ($USE_DATABASE) {
    $conn = get_db_connection();
}

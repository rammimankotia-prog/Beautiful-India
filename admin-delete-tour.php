<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';

if (isset($_GET['id'])) {
    $tour_id = $_GET['id'];
    if (delete_tour($tour_id)) {
        header("Location: admin-manage-tours.php?status=deleted");
        exit;
    }
}

header("Location: admin-manage-tours.php");
exit;

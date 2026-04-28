<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// 1. Define upload directory
$uploadDir = __DIR__ . '/uploads/vehicles/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = ["success" => false, "message" => "Unknown error"];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $fileName = time() . '_' . basename($file['name']);
    $targetFilePath = $uploadDir . $fileName;
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

    // Allow certain file formats
    $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp');
    if (in_array(strtolower($fileType), $allowTypes)) {
        // Upload file to server
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            // Return public URL
            // Assuming this is in /public_html/ or similar
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $publicPath = "/uploads/vehicles/" . $fileName;
            
            $response = [
                "success" => true,
                "message" => "Image uploaded successfully",
                "url" => $publicPath,
                "fileName" => $fileName
            ];
        } else {
            $response["message"] = "Sorry, there was an error uploading your file.";
        }
    } else {
        $response["message"] = "Sorry, only JPG, JPEG, PNG, GIF, & WEBP files are allowed.";
    }
} else {
    $response["message"] = "No file uploaded or invalid request.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>

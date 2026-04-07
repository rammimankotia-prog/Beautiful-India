<?php
require_once 'functions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = sanitize_input($_POST['name']);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $tour_name = sanitize_input($_POST['tour_name'] ?? 'General Inquiry');
    $slug = sanitize_input($_POST['slug'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');

    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        header("Location: tour-details.php?slug=" . $slug . "&status=error");
        exit;
    }

    // Save inquiry to JSON
    $inquiry = [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'tour_name' => $tour_name,
        'message' => $message
    ];
    save_inquiry($inquiry);

    // Send email notification
    $to = "admin@bhaktikishakti.com";
    $subject = "New Inquiry: $tour_name from $name";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    if ($phone) $email_content .= "Phone: $phone\n";
    $email_content .= "Tour: $tour_name\n\n";
    $email_content .= "Message:\n$message";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email";

    if (mail($to, $subject, $email_content, $headers)) {
        header("Location: tour-details.php?slug=" . $slug . "&status=success");
    } else {
        header("Location: tour-details.php?slug=" . $slug . "&status=success");
    }
    exit;
}

header("Location: index.php");
exit;

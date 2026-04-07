<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';
$inquiries = get_all_inquiries();
$inquiries = array_reverse($inquiries);

$message = '';
if (isset($_GET['status']) && $_GET['status'] === 'deleted') {
    $message = '<div class="bg-green-50 text-green-600 p-4 rounded-lg mb-4 text-sm font-medium">Inquiry deleted successfully!</div>';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Inquiries - Bharat Darshan Admin</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#006D77",
                        "accent": "#FFDDD2",
                        "background-light": "#EDF6F9",
                        "text-main": "#2C3E50",
                        "text-muted": "#7F8C8D"
                    },
                    fontFamily: { "display": ["Montserrat", "sans-serif"] }
                },
            },
        }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; }
    </style>
</head>
<body class="bg-background-light min-h-screen">
    <header class="bg-white border-b border-primary/10 px-4 md:px-10 py-4">
        <div class="flex items-center justify-between max-w-[1400px] mx-auto">
            <div class="flex items-center gap-4 text-primary">
                <span class="material-symbols-outlined text-3xl">explore</span>
                <h2 class="text-xl font-bold">Bharat Darshan Admin</h2>
            </div>
            <div class="flex items-center gap-4">
                <a href="index.php" class="text-text-muted hover:text-primary text-sm">View Live Site</a>
                <a href="logout.php" class="text-red-500 hover:text-red-600 text-sm font-medium">Logout</a>
            </div>
        </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-4 md:px-10 py-8">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-text-main">Inquiries</h1>
                <p class="text-text-muted">View all contact form submissions</p>
            </div>
            <a href="admin-dashboard.php" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-text-main font-medium rounded-lg transition-colors">
                Back to Dashboard
            </a>
        </div>

        <?php echo $message; ?>

        <?php if (empty($inquiries)): ?>
            <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-text-muted mb-4">inbox</span>
                <p class="text-text-muted">No inquiries yet. When visitors contact you, they will appear here.</p>
            </div>
        <?php else: ?>
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">ID</th>
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Name</th>
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Email</th>
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Phone</th>
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Tour Interest</th>
                                <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($inquiries as $inquiry): ?>
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-4 px-6 text-text-muted"><?php echo $inquiry['id']; ?></td>
                                <td class="py-4 px-6 font-medium"><?php echo $inquiry['name']; ?></td>
                                <td class="py-4 px-6 text-primary"><?php echo $inquiry['email']; ?></td>
                                <td class="py-4 px-6 text-text-muted"><?php echo $inquiry['phone'] ?? '-'; ?></td>
                                <td class="py-4 px-6 text-text-muted"><?php echo $inquiry['tour_name']; ?></td>
                                <td class="py-4 px-6 text-text-muted text-sm"><?php echo date('M d, Y H:i', strtotime($inquiry['created_at'])); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </main>
</body>
</html>

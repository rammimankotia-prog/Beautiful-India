<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';
$tours = get_all_tours();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MJXSC78EE2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-MJXSC78EE2');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Bharat Darshan</title>
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
                        "background-dark": "#0B1A1C",
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
        <div class="grid md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary">place</span>
                    </div>
                    <div>
                        <p class="text-text-muted text-sm">Total Destinations</p>
                        <p class="text-2xl font-bold text-text-main"><?php echo count($tours); ?></p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-green-600">visibility</span>
                    </div>
                    <div>
                        <p class="text-text-muted text-sm">Page Views</p>
                        <p class="text-2xl font-bold text-text-main">1,234</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-blue-600">email</span>
                    </div>
                    <div>
                        <p class="text-text-muted text-sm">Inquiries</p>
                        <p class="text-2xl font-bold text-text-main"><?php echo count(get_all_inquiries()); ?></p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-yellow-600">star</span>
                    </div>
                    <div>
                        <p class="text-text-muted text-sm">Rating</p>
                        <p class="text-2xl font-bold text-text-main">4.9</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-text-main">Quick Actions</h2>
            </div>
            <div class="grid md:grid-cols-4 gap-4">
                <a href="admin-add-post.php" class="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-primary text-2xl">add_circle</span>
                    <div>
                        <p class="font-semibold text-text-main">Add New Tour</p>
                        <p class="text-text-muted text-sm">Create a new tour post</p>
                    </div>
                </a>
                <a href="admin-manage-tours.php" class="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-primary text-2xl">edit_note</span>
                    <div>
                        <p class="font-semibold text-text-main">Manage Tours</p>
                        <p class="text-text-muted text-sm">Edit or delete tours</p>
                    </div>
                </a>
                <a href="admin-inquiries.php" class="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-primary text-2xl">mail</span>
                    <div>
                        <p class="font-semibold text-text-main">View Inquiries</p>
                        <p class="text-text-muted text-sm">Contact form submissions</p>
                    </div>
                </a>
                <a href="index.php" class="flex items-center gap-4 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-primary text-2xl">home</span>
                    <div>
                        <p class="font-semibold text-text-main">Home Page</p>
                        <p class="text-text-muted text-sm">View the live site</p>
                    </div>
                </a>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-text-main">Manage Destinations</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 px-4 text-text-muted font-semibold text-sm">ID</th>
                            <th class="text-left py-3 px-4 text-text-muted font-semibold text-sm">Title</th>
                            <th class="text-left py-3 px-4 text-text-muted font-semibold text-sm">Price</th>
                            <th class="text-left py-3 px-4 text-text-muted font-semibold text-sm">Duration</th>
                            <th class="text-left py-3 px-4 text-text-muted font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($tours as $tour): ?>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-3 px-4 text-text-muted"><?php echo $tour['id']; ?></td>
                            <td class="py-3 px-4 font-medium"><?php echo $tour['title']; ?></td>
                            <td class="py-3 px-4 text-primary font-semibold"><?php echo $tour['price']; ?></td>
                            <td class="py-3 px-4 text-text-muted"><?php echo $tour['duration']; ?></td>
                            <td class="py-3 px-4">
                                <a href="tour-details.php?slug=<?php echo $tour['slug']; ?>" class="text-primary hover:text-primary/80 text-sm font-medium">View</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>

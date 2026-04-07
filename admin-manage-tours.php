<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';
$tours = get_all_tours();

$message = '';
if (isset($_GET['status'])) {
    if ($_GET['status'] === 'deleted') {
        $message = '<div class="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm font-medium">Tour deleted successfully!</div>';
    } elseif ($_GET['status'] === 'updated') {
        $message = '<div class="bg-green-50 text-green-600 p-4 rounded-lg mb-4 text-sm font-medium">Tour updated successfully!</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Tours - Bharat Darshan Admin</title>
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
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-text-main">Manage Tours</h1>
                <p class="text-text-muted">Add, edit, or delete tour packages</p>
            </div>
            <a href="admin-add-post.php" class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors">
                <span class="material-symbols-outlined">add</span>
                Add New Tour
            </a>
        </div>

        <?php echo $message; ?>

        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">ID</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Image</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Title</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Location</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Price</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Duration</th>
                            <th class="text-left py-4 px-6 text-text-muted font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($tours as $tour): ?>
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-4 px-6 text-text-muted"><?php echo $tour['id']; ?></td>
                            <td class="py-4 px-6">
                                <div class="w-16 h-12 bg-cover bg-center rounded-lg" style='background-image: url("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=200");'></div>
                            </td>
                            <td class="py-4 px-6 font-medium"><?php echo $tour['title']; ?></td>
                            <td class="py-4 px-6 text-text-muted"><?php echo $tour['location'] ?? 'N/A'; ?></td>
                            <td class="py-4 px-6 text-primary font-semibold"><?php echo $tour['price']; ?></td>
                            <td class="py-4 px-6 text-text-muted"><?php echo $tour['duration']; ?></td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-3">
                                    <a href="admin-edit-tour.php?id=<?php echo $tour['id']; ?>" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                                        <span class="material-symbols-outlined text-sm">edit</span> Edit
                                    </a>
                                    <a href="admin-delete-tour.php?id=<?php echo $tour['id']; ?>" onclick="return confirm('Are you sure you want to delete this tour?');" class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
                                        <span class="material-symbols-outlined text-sm">delete</span> Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-8 flex gap-4">
            <a href="admin-dashboard.php" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-text-main font-medium rounded-lg transition-colors">
                Back to Dashboard
            </a>
        </div>
    </main>
</body>
</html>

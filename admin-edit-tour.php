<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';

$tour_id = $_GET['id'] ?? 0;
$tour = get_tour_by_id($tour_id);

if (!$tour) {
    header("Location: admin-manage-tours.php");
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $updated_tour = [
        'title' => sanitize_input($_POST['title']),
        'slug' => generate_slug($_POST['title']),
        'description' => sanitize_input($_POST['description']),
        'price' => sanitize_input($_POST['price']),
        'duration' => sanitize_input($_POST['duration']),
        'location' => sanitize_input($_POST['location'])
    ];
    
    if (update_tour($tour_id, $updated_tour)) {
        header("Location: admin-manage-tours.php?status=updated");
        exit;
    } else {
        $error = "Failed to update tour. Please try again.";
    }
}
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
    <title>Edit Tour - Bharat Darshan Admin</title>
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
                <h1 class="text-2xl font-bold text-text-main">Edit Tour</h1>
                <p class="text-text-muted">Update tour package details</p>
            </div>
        </div>

        <?php if($error): ?>
            <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium"><?php echo $error; ?></div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Tour Title</label>
                    <input type="text" name="title" value="<?php echo $tour['title']; ?>" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Description</label>
                    <textarea name="description" rows="5" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"><?php echo $tour['description']; ?></textarea>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">Price (INR)</label>
                        <input type="text" name="price" value="<?php echo $tour['price']; ?>" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">Duration</label>
                        <input type="text" name="duration" value="<?php echo $tour['duration']; ?>" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Location</label>
                    <input type="text" name="location" value="<?php echo $tour['location'] ?? ''; ?>" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors">
                        Update Tour
                    </button>
                    <a href="admin-manage-tours.php" class="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-text-main font-medium rounded-lg transition-colors">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    </main>
</body>
</html>

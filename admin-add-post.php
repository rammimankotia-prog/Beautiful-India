<?php
session_start();
if (!isset($_SESSION['loggedin'])) {
    header("Location: admin-login.php");
    exit;
}

require_once 'functions.php';
$success_message = '';
$error_message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = sanitize_input($_POST['title']);
    $description = sanitize_input($_POST['description']);
    $price = sanitize_input($_POST['price']);
    $duration = sanitize_input($_POST['duration']);
    $location = sanitize_input($_POST['location']);
    
    $slug = generate_slug($title);
    
    $tours = get_all_tours();
    $new_id = count($tours) > 0 ? max(array_column($tours, 'id')) + 1 : 1;
    
    $new_tour = [
        'id' => $new_id,
        'title' => $title,
        'slug' => $slug,
        'description' => $description,
        'image' => 'placeholder.jpg',
        'price' => $price,
        'duration' => $duration,
        'location' => $location
    ];
    
    $tours[] = $new_tour;
    
    if (file_put_contents('tours.json', json_encode($tours, JSON_PRETTY_PRINT))) {
        $success_message = "Destination '$title' has been published successfully!";
    } else {
        $error_message = "Failed to save. Please check file permissions.";
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
    <title>Add New Destination - Bharat Darshan</title>
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
                <a href="admin-dashboard.php" class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-3xl">explore</span>
                    <h2 class="text-xl font-bold">Bharat Darshan</h2>
                </a>
            </div>
            <div class="flex items-center gap-4">
                <a href="admin-dashboard.php" class="text-text-muted hover:text-primary text-sm">← Back to Dashboard</a>
            </div>
        </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-8">
        <div class="bg-white rounded-xl shadow-sm p-8">
            <h1 class="text-2xl font-bold text-text-main mb-6">Create New Destination</h1>
            
            <?php if($success_message): ?>
                <div class="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                    <?php echo $success_message; ?>
                </div>
            <?php endif; ?>
            
            <?php if($error_message): ?>
                <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    <?php echo $error_message; ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Destination Title</label>
                    <input type="text" name="title" placeholder="e.g., Spiritual Varanasi" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">Price</label>
                        <input type="text" name="price" placeholder="e.g., ₹5,000" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-text-main mb-2">Duration</label>
                        <input type="text" name="duration" placeholder="e.g., 3 Days" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Location</label>
                    <input type="text" name="location" placeholder="e.g., Varanasi, Uttar Pradesh" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-text-main mb-2">Description</label>
                    <textarea name="description" rows="5" placeholder="Describe the tour experience..." required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"></textarea>
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors">
                        Publish Destination
                    </button>
                    <a href="admin-dashboard.php" class="py-3 px-6 bg-gray-200 hover:bg-gray-300 text-text-main font-bold rounded-lg transition-colors">
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    </main>
</body>
</html>

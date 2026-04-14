<?php
require_once 'functions.php';
$posts = get_all_blog_posts();
$page_title = "Travel Stories & Blog - Bharat Darshan";
$meta_desc = "Read travel stories, tips, and guides about exploring India. From Varanasi to Kerala, discover the wonders of Incredible India with Bharat Darshan.";
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
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">
    <link rel="canonical" href="https://bhaktikishakti.com/blog.php" />
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
                        "text-muted": "#7F8C8D",
                        "bharat-gold": "#E6A11C"
                    },
                    fontFamily: { "display": ["Montserrat", "sans-serif"] }
                },
            },
        }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { width: 100%; overflow-x: hidden; font-family: 'Montserrat', sans-serif; }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Bharat Darshan Travel Stories",
      "url": "https://bhaktikishakti.com/blog.php",
      "description": "Travel stories, tips, and guides about exploring India"
    }
    </script>
</head>
<body class="bg-background-light text-text-main font-display">
    <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-4 md:px-10 lg:px-40 py-4 bg-white sticky top-0 z-50">
        <div class="flex items-center gap-4 text-primary">
            <a href="index.php" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-3xl">explore</span>
                <h2 class="text-xl md:text-2xl font-bold tracking-tight">Bharat Darshan</h2>
            </a>
        </div>
        <nav class="hidden md:flex items-center gap-8">
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="index.php#destinations">Destinations</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="about.php">About Us</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="blog.php">Travel Stories</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="contact.php">Contact</a>
        </nav>
        <div class="flex items-center gap-4">
            <a href="admin-login.php" class="hidden md:block text-sm text-text-muted hover:text-primary">Admin</a>
            <button class="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-md">
                Book Now
            </button>
        </div>
    </header>

    <main>
        <section class="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center">
            <div class="absolute inset-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 109, 119, 0.7) 0%, rgba(11, 26, 28, 0.9) 100%), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"); background-position: center;'></div>
            <div class="relative z-10 text-center px-4">
                <h1 class="text-white text-4xl md:text-5xl font-black mb-4">Travel Stories</h1>
                <p class="text-white/90 text-lg">Tales from the road less traveled</p>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16">
            <div class="max-w-[1400px] mx-auto">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php foreach ($posts as $post): ?>
                    <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                        <a href="blog-post.php?slug=<?php echo $post['slug']; ?>" class="block">
                            <div class="aspect-[16/10] bg-cover bg-center" style='background-image: url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600");'></div>
                            <div class="p-6">
                                <div class="flex items-center gap-2 text-text-muted text-sm mb-3">
                                    <span class="material-symbols-outlined text-sm">calendar_today</span>
                                    <?php echo date('M d, Y', strtotime($post['date'])); ?>
                                    <span class="material-symbols-outlined text-sm ml-2">person</span>
                                    <?php echo $post['author']; ?>
                                </div>
                                <h2 class="text-text-main text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2"><?php echo $post['title']; ?></h2>
                                <p class="text-text-muted line-clamp-3"><?php echo $post['excerpt']; ?></p>
                            </div>
                        </a>
                    </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-primary">
            <div class="max-w-[1400px] mx-auto text-center">
                <h2 class="text-white text-3xl font-black mb-4">Share Your Travel Story</h2>
                <p class="text-white/80 mb-6">Have you traveled with Bharat Darshan? We would love to hear about your experience.</p>
                <a href="contact.php" class="inline-flex items-center justify-center rounded-full h-12 px-8 bg-bharat-gold hover:bg-bharat-gold/90 transition-colors text-white text-base font-bold">
                    Get in Touch
                </a>
            </div>
        </section>
    </main>

    <footer class="w-full flex flex-col gap-6 border-t border-primary/10 px-5 py-10 bg-background-dark text-center">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1400px] mx-auto w-full">
            <div class="flex items-center gap-2 text-accent opacity-80">
                <span class="material-symbols-outlined">explore</span>
                <span class="font-bold tracking-tight">Bharat Darshan</span>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <a class="text-slate-400 hover:text-accent transition-colors text-sm font-semibold" href="#">Privacy Policy</a>
                <a class="text-slate-400 hover:text-accent transition-colors text-sm font-semibold" href="#">Terms of Service</a>
                <a class="text-slate-400 hover:text-accent transition-colors text-sm font-semibold" href="contact.php">Contact Us</a>
            </div>
        </div>
        <p class="text-slate-500 text-sm font-medium mt-4">© 2026 Bharat Darshan. All rights reserved.</p>
    </footer>
</body>
</html>

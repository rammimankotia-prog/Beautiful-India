<?php
require_once 'functions.php';

$current_slug = $_GET['slug'] ?? '';
$post = get_blog_post_by_slug($current_slug);

if (!$post) {
    header("Location: blog.php");
    exit;
}

$page_title = $post['title'] . " - Bharat Darshan";
$meta_desc = $post['excerpt'];
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
    <link rel="canonical" href="https://bhaktikishakti.com/blog-post.php?slug=<?php echo $post['slug']; ?>" />
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
      "@type": "BlogPosting",
      "headline": "<?php echo $post['title']; ?>",
      "description": "<?php echo $post['excerpt']; ?>",
      "author": {
        "@type": "Person",
        "name": "<?php echo $post['author']; ?>"
      },
      "datePublished": "<?php echo $post['date']; ?>",
      "url": "https://bhaktikishakti.com/blog-post.php?slug=<?php echo $post['slug']; ?>"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bhaktikishakti.com/"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Travel Stories",
        "item": "https://bhaktikishakti.com/blog.php"
      },{
        "@type": "ListItem",
        "position": 3,
        "name": "<?php echo $post['title']; ?>",
        "item": "https://bhaktikishakti.com/blog-post.php?slug=<?php echo $post['slug']; ?>"
      }]
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
        <article>
            <section class="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
                <div class="absolute inset-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 109, 119, 0.5) 0%, rgba(11, 26, 28, 0.8) 100%), url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920"); background-position: center;'></div>
                <div class="relative z-10 text-center px-4 max-w-4xl">
                    <div class="flex items-center justify-center gap-4 text-white/80 text-sm mb-4">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">calendar_today</span> <?php echo date('M d, Y', strtotime($post['date'])); ?></span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">person</span> <?php echo $post['author']; ?></span>
                    </div>
                    <h1 class="text-white text-3xl md:text-5xl font-black mb-4"><?php echo $post['title']; ?></h1>
                </div>
            </section>

            <section class="w-full px-4 md:px-10 lg:px-40 py-12">
                <div class="max-w-[800px] mx-auto">
                    <div class="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                        <p class="text-text-muted text-xl leading-relaxed mb-8"><?php echo $post['excerpt']; ?></p>
                        <div class="prose prose-lg max-w-none text-text-main">
                            <p class="leading-relaxed mb-6"><?php echo $post['content']; ?></p>
                            <p class="leading-relaxed mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p class="leading-relaxed mb-6">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        
                        <div class="mt-12 pt-8 border-t border-gray-200">
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">India</span>
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Travel</span>
                                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">Adventure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>

        <section class="w-full px-4 md:px-10 lg:px-40 py-12 bg-white">
            <div class="max-w-[800px] mx-auto">
                <h3 class="text-xl font-bold mb-6">More Travel Stories</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    <?php 
                    $all_posts = get_all_blog_posts();
                    $related = array_filter($all_posts, function($p) use ($post) { return $p['slug'] !== $post['slug']; });
                    $related = array_slice($related, 0, 2);
                    foreach($related as $rel): ?>
                    <a href="blog-post.php?slug=<?php echo $rel['slug']; ?>" class="group flex gap-4 items-start">
                        <div class="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0" style='background-image: url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200");'></div>
                        <div>
                            <h4 class="font-bold group-hover:text-primary transition-colors line-clamp-2"><?php echo $rel['title']; ?></h4>
                            <p class="text-text-muted text-sm"><?php echo date('M d, Y', strtotime($rel['date'])); ?></p>
                        </div>
                    </a>
                    <?php endforeach; ?>
                </div>
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

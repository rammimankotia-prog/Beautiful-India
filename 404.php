<?php
$page_title = "404 - Page Not Found";
$meta_desc = "Sorry, the page you are looking for does not exist on Bharat Darshan.";
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
    <link rel="canonical" href="https://bhaktikishakti.com/404.php" />
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
      "@type": "WebPage",
      "name": "404 - Page Not Found",
      "url": "https://bhaktikishakti.com/404.php",
      "description": "Page not found error"
    }
    </script>
</head>
<body class="bg-background-light text-text-main font-display min-h-screen flex flex-col">
    <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-4 md:px-10 lg:px-40 py-4 bg-white">
        <div class="flex items-center gap-4 text-primary">
            <a href="index.php" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-3xl">explore</span>
                <h2 class="text-xl md:text-2xl font-bold tracking-tight">Bharat Darshan</h2>
            </a>
        </div>
        <nav class="hidden md:flex items-center gap-8">
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="index.php#destinations">Destinations</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="about.php">About Us</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="contact.php">Contact</a>
        </nav>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 py-16">
        <div class="text-center max-w-2xl">
            <div class="mb-8">
                <span class="text-[150px] md:text-[200px] font-black text-primary/10 leading-none">404</span>
            </div>
            <h1 class="text-primary text-4xl md:text-5xl font-black mb-4">Page Not Found</h1>
            <p class="text-text-muted text-lg mb-8">Oops! The page you are looking for seems to have wandered off. Let us help you find your way back to Incredible India.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="index.php" class="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-colors">
                    <span class="material-symbols-outlined">home</span>
                    Back to Home
                </a>
                <a href="contact.php" class="flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                    <span class="material-symbols-outlined">contact_support</span>
                    Contact Us
                </a>
            </div>
        </div>
    </main>

    <section class="w-full px-4 md:px-10 lg:px-40 py-12 bg-primary">
        <div class="max-w-[1400px] mx-auto text-center">
            <h2 class="text-white text-2xl md:text-3xl font-black mb-4">Explore Our Popular Destinations</h2>
            <p class="text-white/80 mb-6">Discover the magic of India with our curated tour packages</p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="tour-details.php?slug=golden-triangle" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">Golden Triangle</a>
                <a href="tour-details.php?slug=spiritual-varanasi" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">Varanasi</a>
                <a href="tour-details.php?slug=kerala-backwaters" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">Kerala Backwaters</a>
                <a href="tour-details.php?slug=majestic-rajasthan" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors">Rajasthan</a>
            </div>
        </div>
    </section>

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

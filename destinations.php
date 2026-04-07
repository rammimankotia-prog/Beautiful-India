<?php
require_once 'functions.php';
$tours = get_all_tours();
$page_title = "Destinations - Explore India | Bharat Darshan";
$meta_desc = "Browse all our tour packages and discover the best destinations in India. From the Himalayas to Kerala backwaters, find your perfect Indian adventure.";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">
    <link rel="canonical" href="https://bhaktikishakti.com/destinations.php" />
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
      "@type": "CollectionPage",
      "name": "Tour Destinations",
      "url": "https://bhaktikishakti.com/destinations.php",
      "description": "Explore all our tour packages and destinations in India"
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
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="destinations.php">Destinations</a>
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
            <div class="absolute inset-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 109, 119, 0.7) 0%, rgba(11, 26, 28, 0.9) 100%), url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920"); background-position: center;'></div>
            <div class="relative z-10 text-center px-4">
                <h1 class="text-white text-4xl md:text-5xl font-black mb-4">Our Destinations</h1>
                <p class="text-white/90 text-lg">Explore the wonders of Incredible India</p>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16">
            <div class="max-w-[1400px] mx-auto">
                <div class="flex flex-wrap gap-3 mb-10">
                    <button class="filter-btn active px-5 py-2 rounded-full bg-primary text-white font-medium text-sm" data-filter="all">All Destinations</button>
                    <button class="filter-btn px-5 py-2 rounded-full bg-white border border-gray-300 text-text-muted font-medium text-sm hover:border-primary hover:text-primary transition-colors" data-filter="north">North India</button>
                    <button class="filter-btn px-5 py-2 rounded-full bg-white border border-gray-300 text-text-muted font-medium text-sm hover:border-primary hover:text-primary transition-colors" data-filter="south">South India</button>
                    <button class="filter-btn px-5 py-2 rounded-full bg-white border border-gray-300 text-text-muted font-medium text-sm hover:border-primary hover:text-primary transition-colors" data-filter="west">West India</button>
                    <button class="filter-btn px-5 py-2 rounded-full bg-white border border-gray-300 text-text-muted font-medium text-sm hover:border-primary hover:text-primary transition-colors" data-filter="east">East India</button>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="tours-grid">
                    <?php foreach ($tours as $tour): ?>
                    <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary/5" data-category="north">
                        <div class="relative w-full aspect-[4/3] overflow-hidden">
                            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style='background-image: url("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600");'></div>
                            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm text-yellow-500">star</span>
                                <span class="text-sm font-bold">4.9</span>
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-grow">
                            <div class="flex items-center gap-1 text-text-muted text-xs font-semibold mb-2 uppercase tracking-wider">
                                <span class="material-symbols-outlined text-sm">schedule</span> <?php echo $tour['duration']; ?>
                            </div>
                            <h3 class="text-text-main text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors"><?php echo $tour['title']; ?></h3>
                            <p class="text-text-muted text-sm mb-4 line-clamp-2"><?php echo $tour['description']; ?></p>
                            <div class="mt-auto flex items-center justify-between border-t border-primary/10 pt-4">
                                <div>
                                    <span class="text-xs text-text-muted">From</span>
                                    <div class="text-primary text-xl font-black"><?php echo $tour['price']; ?></div>
                                </div>
                                <a href="tour-details.php?slug=<?php echo $tour['slug']; ?>" class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-primary">
            <div class="max-w-[1400px] mx-auto text-center">
                <h2 class="text-white text-3xl font-black mb-4">Can't Find What You're Looking For?</h2>
                <p class="text-white/80 mb-6">We offer custom tours tailored to your preferences. Contact us to plan your dream trip.</p>
                <a href="contact.php" class="inline-flex items-center justify-center rounded-full h-12 px-8 bg-bharat-gold hover:bg-bharat-gold/90 transition-colors text-white text-base font-bold">
                    Plan Your Trip
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

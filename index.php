<?php
require_once 'functions.php';
$tours = get_all_tours();
$page_title = "Explore India | Bharat Darshan";
$meta_desc = "Discover the best travel destinations in India. Book your Bharat Darshan tour today and explore the spiritual and cultural heritage of India.";
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
    <meta name="google-site-verification" content="vIh1jAvVGskK00z5B0FHJrXzeriHcZyQTUvxwbTcQfs" />
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">
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
                    fontFamily: {
                        "display": ["Montserrat", "sans-serif"]
                    }
                },
            },
        }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { width: 100%; overflow-x: hidden; font-family: 'Montserrat', sans-serif; }
        .full-width { width: 100vw; }
        .hero-section {
            width: 100%;
            height: 85vh;
            background-size: cover;
            background-position: center;
        }
        .destinations-grid {
            display: grid;
            width: 100%;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        @media (max-width: 768px) {
            .hero-section { height: 60vh; }
            .destinations-grid { grid-template-columns: 1fr; }
        }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Bharat Darshan",
      "url": "https://bhaktikishakti.com",
      "logo": "https://bhaktikishakti.com/logo.png",
      "description": "Explore the spiritual and cultural heritage of India with Bharat Darshan's curated tour packages.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://bhaktikishakti.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
</head>
<body class="bg-background-light text-text-main font-display full-width">
    <div class="full-width">
        <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-4 md:px-10 lg:px-40 py-4 bg-white sticky top-0 z-50" id="main-header">
            <div class="flex items-center gap-4 text-primary">
                <span class="material-symbols-outlined text-3xl">explore</span>
                <h2 class="text-xl md:text-2xl font-bold tracking-tight">Bharat Darshan</h2>
            </div>
            <nav class="hidden md:flex items-center gap-8" id="nav-menu">
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="#destinations">Destinations</a>
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="#about">About Us</a>
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="destinations.php">All Tours</a>
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="blog.php">Blog</a>
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="gallery.php">Gallery</a>
                <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="contact.php">Contact</a>
            </nav>
            <div class="flex items-center gap-4">
                <a href="admin-login.php" class="hidden md:block text-sm text-text-muted hover:text-primary">Admin</a>
                <button class="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-md">
                    Book Now
                </button>
                <button class="md:hidden p-2 text-text-main hover:text-primary" id="mobile-menu-btn">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
            </div>
        </header>

        <div class="hidden fixed inset-0 bg-white z-40 md:hidden" id="mobile-menu">
            <div class="flex flex-col p-4">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-2 text-primary">
                        <span class="material-symbols-outlined text-2xl">explore</span>
                        <span class="font-bold">Bharat Darshan</span>
                    </div>
                    <button id="close-menu" class="p-2">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                <nav class="flex flex-col gap-4">
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="#destinations">Destinations</a>
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="#about">About Us</a>
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="destinations.php">All Tours</a>
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="blog.php">Blog</a>
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="gallery.php">Gallery</a>
                    <a class="text-text-main text-lg font-semibold py-2 border-b" href="contact.php">Contact</a>
                </nav>
            </div>
        </div>

        <main>
            <section class="hero-section relative flex flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center" style='background-image: linear-gradient(rgba(0, 109, 119, 0.4) 0%, rgba(11, 26, 28, 0.7) 100%), url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920");'>
                <div class="relative z-10 flex flex-col gap-4 text-center max-w-4xl mx-auto mt-10 px-4">
                    <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
                        Discover Incredible India
                    </h1>
                    <h2 class="text-background-light text-base md:text-xl font-medium leading-relaxed drop-shadow-md">
                        Experience the spiritual and cultural heritage of India with Bharat Darshan's curated tour packages.
                    </h2>
                </div>
                <div class="relative z-10 w-full max-w-2xl mt-8 px-4">
                    <form action="tour-details.php" method="GET" class="flex flex-col md:flex-row w-full bg-white rounded-xl md:rounded-full p-2 shadow-2xl">
                        <div class="flex items-center pl-4 pr-2 text-text-muted py-3 md:py-0">
                            <span class="material-symbols-outlined text-xl">search</span>
                        </div>
                        <input class="w-full bg-transparent border-none text-text-main focus:ring-0 placeholder:text-text-muted py-3 md:py-4 px-2 text-base font-medium outline-none" placeholder="Where in India do you want to go?" type="text" name="slug"/>
                        <button type="submit" class="mt-2 md:mt-0 w-full md:w-auto flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg md:rounded-full h-12 px-8 bg-primary hover:bg-primary/90 transition-colors text-white text-base font-bold whitespace-nowrap">
                            Search Tours
                        </button>
                    </form>
                </div>
            </section>

            <section id="destinations" class="w-full px-4 md:px-10 lg:px-40 py-16 bg-background-light">
                <div class="max-w-[1400px] mx-auto">
                    <div class="flex items-end justify-between mb-8">
                        <div>
                            <h2 class="text-primary text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">Featured Destinations</h2>
                            <p class="text-text-muted font-medium">Handpicked experiences for your next journey</p>
                        </div>
                    </div>
                    <div class="destinations-grid">
                        <?php foreach ($tours as $tour): ?>
                        <div class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary/5">
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

            <section id="about" class="w-full px-4 md:px-10 lg:px-40 py-16 bg-white">
                <div class="max-w-[1400px] mx-auto">
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 class="text-primary text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4">Experience India Like Never Before</h2>
                            <p class="text-text-muted text-lg mb-6 leading-relaxed">
                                Bharat Darshan brings you closer to the incredible diversity of India. From the snowy peaks of the Himalayas to the serene backwaters of Kerala, we curate unforgettable journeys that capture the essence of this magnificent land.
                            </p>
                            <p class="text-text-muted text-lg mb-8 leading-relaxed">
                                Our expert guides and carefully planned itineraries ensure you experience the real India - its spirituality, culture, traditions, and natural beauty.
                            </p>
                            <div class="flex gap-8">
                                <div>
                                    <div class="text-primary text-3xl font-black">50+</div>
                                    <div class="text-text-muted text-sm">Destinations</div>
                                </div>
                                <div>
                                    <div class="text-primary text-3xl font-black">10K+</div>
                                    <div class="text-text-muted text-sm">Happy Travelers</div>
                                </div>
                                <div>
                                    <div class="text-primary text-3xl font-black">5★</div>
                                    <div class="text-text-muted text-sm">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl" style='background-image: url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"); background-size: cover; background-position: center;'></div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-primary">
                <div class="max-w-[1400px] mx-auto text-center">
                    <h2 class="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mb-4">Ready to Start Your Journey?</h2>
                    <p class="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Let our experts help you plan the perfect Indian adventure. Contact us today for a personalized itinerary.
                    </p>
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
    </div>
    <script>
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenu = document.getElementById('close-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
            });
            closeMenu.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        }

        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    </script>
</body>
</html>

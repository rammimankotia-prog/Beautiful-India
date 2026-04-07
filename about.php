<?php
$page_title = "About Us - Discover India with Bharat Darshan";
$meta_desc = "Learn about Bharat Darshan - your trusted partner for exploring the spiritual and cultural heritage of India. Expert guides, curated itineraries, unforgettable experiences.";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $meta_desc; ?>">
    <link rel="canonical" href="https://bhaktikishakti.com/about.php" />
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
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "TravelAgency",
        "name": "Bharat Darshan",
        "url": "https://bhaktikishakti.com/about.php",
        "description": "Your trusted partner for exploring the spiritual and cultural heritage of India",
        "image": "https://bhaktikishakti.com/images/about-us.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "New Delhi",
          "addressCountry": "IN"
        }
      }
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
        <section class="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
            <div class="absolute inset-0 bg-cover bg-center" style='background-image: linear-gradient(rgba(0, 109, 119, 0.6) 0%, rgba(11, 26, 28, 0.8) 100%), url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920"); background-position: center;'></div>
            <div class="relative z-10 text-center px-4 max-w-4xl">
                <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-black mb-4">About Bharat Darshan</h1>
                <p class="text-white/90 text-lg md:text-xl">Bridging travelers to the soul of India since 2020</p>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-white">
            <div class="max-w-[1400px] mx-auto">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 class="text-primary text-3xl md:text-4xl font-black mb-6">Our Story</h2>
                        <p class="text-text-muted text-lg mb-6 leading-relaxed">
                            Bharat Darshan was born from a passion to showcase the incredible diversity of India to the world. We believe that travel is not just about visiting places—it's about transformative experiences that touch the soul.
                        </p>
                        <p class="text-text-muted text-lg mb-6 leading-relaxed">
                            Our team of travel experts, local guides, and passionate storytellers work tirelessly to create curated journeys that capture the essence of India's rich heritage, spiritual wisdom, and natural beauty.
                        </p>
                        <p class="text-text-muted text-lg leading-relaxed">
                            From the snow-capped Himalayas to the serene backwaters of Kerala, from the vibrant markets of Rajasthan to the ancient temples of South India—we bring you closer to the real India.
                        </p>
                    </div>
                    <div class="relative">
                        <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl" style='background-image: url("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"); background-size: cover; background-position: center;'></div>
                        <div class="absolute -bottom-6 -left-6 bg-bharat-gold text-white p-6 rounded-xl shadow-lg">
                            <div class="text-4xl font-black">5+</div>
                            <div class="font-semibold">Years of Excellence</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-background-light">
            <div class="max-w-[1400px] mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-primary text-3xl md:text-4xl font-black mb-4">Why Choose Bharat Darshan?</h2>
                    <p class="text-text-muted text-lg max-w-2xl mx-auto">We go above and beyond to make your Indian journey truly unforgettable</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">local_expert</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Expert Local Guides</h3>
                        <p class="text-text-muted">Our guides are locals with deep knowledge of history, culture, and hidden gems that most tourists miss.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">handshake</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Authentic Experiences</h3>
                        <p class="text-text-muted">We connect you with local families, traditional craftspeople, and spiritual masters for genuine cultural immersion.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">support_agent</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">24/7 Support</h3>
                        <p class="text-text-muted">From planning to your last day in India, our team is available round the clock to assist you.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">hotel</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Quality Accommodations</h3>
                        <p class="text-text-muted">We partner with carefully vetted hotels and guesthouses that meet our high standards of comfort.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">route</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Curated Itineraries</h3>
                        <p class="text-text-muted">Every tour is thoughtfully designed to balance iconic sights with off-the-beaten-path discoveries.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <span class="material-symbols-outlined text-3xl text-primary">verified_user</span>
                        </div>
                        <h3 class="text-xl font-bold mb-4">Best Value</h3>
                        <p class="text-text-muted">Transparent pricing with no hidden costs. We believe in fair value for exceptional experiences.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-white">
            <div class="max-w-[1400px] mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-primary text-3xl md:text-4xl font-black mb-4">Our Numbers Speak</h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl font-black text-primary mb-2">50+</div>
                        <div class="text-text-muted font-medium">Destinations</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl font-black text-primary mb-2">10K+</div>
                        <div class="text-text-muted font-medium">Happy Travelers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl font-black text-primary mb-2">200+</div>
                        <div class="text-text-muted font-medium">Tours Completed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl md:text-5xl font-black text-primary mb-2">4.9</div>
                        <div class="text-text-muted font-medium">Average Rating</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="w-full px-4 md:px-10 lg:px-40 py-16 bg-primary">
            <div class="max-w-[1400px] mx-auto text-center">
                <h2 class="text-white text-3xl md:text-4xl font-black mb-4">Ready to Explore India?</h2>
                <p class="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                    Let our experts help you plan the perfect Indian adventure. Contact us today for a personalized itinerary.
                </p>
                <a href="contact.php" class="inline-flex items-center justify-center rounded-full h-12 px-8 bg-bharat-gold hover:bg-bharat-gold/90 transition-colors text-white text-base font-bold">
                    Start Your Journey
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

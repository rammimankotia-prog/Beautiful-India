<?php
$page_title = "Contact Us | Bharat Darshan";
$meta_desc = "Get in touch with Bharat Darshan for your Indian travel inquiries. We are here to help you plan your perfect trip.";
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
        body { width: 100%; overflow-x: hidden; font-family: 'Montserrat', sans-serif; }
    </style>
</head>
<body class="bg-background-light text-text-main font-display">
    <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-4 md:px-10 lg:px-40 py-4 bg-white">
        <div class="flex items-center gap-4 text-primary">
            <a href="index.php" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-3xl">explore</span>
                <h2 class="text-xl md:text-2xl font-bold tracking-tight">Bharat Darshan</h2>
            </a>
        </div>
        <nav class="hidden md:flex items-center gap-8">
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="index.php#destinations">Destinations</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="index.php#about">About Us</a>
            <a class="text-text-main hover:text-primary transition-colors text-sm font-semibold" href="contact.php">Contact</a>
        </nav>
    </header>

    <main class="w-full px-4 md:px-10 lg:px-40 py-16">
        <div class="max-w-[1200px] mx-auto">
            <div class="text-center mb-12">
                <h1 class="text-primary text-4xl font-black mb-4">Get in Touch</h1>
                <p class="text-text-muted text-lg">Have questions about your India trip? We're here to help!</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12">
                <div class="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 class="text-xl font-bold mb-6">Send us a Message</h2>
                    <form action="contact-handler.php" method="POST" class="space-y-4">
                        <input type="hidden" name="tour_name" value="General Inquiry">
                        <input type="hidden" name="slug" value="">
                        <div>
                            <label class="block text-sm font-semibold text-text-main mb-2">Your Name</label>
                            <input type="text" name="name" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-text-main mb-2">Email Address</label>
                            <input type="email" name="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-text-main mb-2">Message</label>
                            <textarea name="message" rows="5" required class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">email</span>
                            Email
                        </h3>
                        <p class="text-text-muted">admin@bhaktikishakti.com</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">phone</span>
                            Phone
                        </h3>
                        <p class="text-text-muted">+91 12345 67890</p>
                    </div>
                    <div class="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">location_on</span>
                            Address
                        </h3>
                        <p class="text-text-muted">New Delhi, India</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="w-full flex flex-col gap-6 border-t border-primary/10 px-5 py-10 bg-background-dark text-center">
        <p class="text-slate-500 text-sm font-medium">© 2026 Bharat Darshan. All rights reserved.</p>
    </footer>
</body>
</html>

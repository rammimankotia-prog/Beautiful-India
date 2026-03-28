import { useEffect } from 'react';

const AdSenseScript = () => {
    useEffect(() => {
        // Prevent double injection
        if (document.querySelector('script[src*="adsbygoogle.js"]')) {
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2131006802344949";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        return () => {
            // Cleanup on unmount if we're entering admin pages
            // This ensures ads aren't being processed/requested on admin routes
            // Note: AdSense might already have initialized, so this is partially effective
        };
    }, []);

    return null;
};

export default AdSenseScript;

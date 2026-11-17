# Cloudflare build error: "You cannot have two parallel pages that resolve to the same path"
Reason: GitHub repo me purane (old) page folders ab bhi hain, jaise app/gemini-watermark-guide, app/image-prompts etc.
Zip ke app/(legacy)/... wale folders ke saath ye conflict karte hain.
Fix (sabse safe): GitHub repo me purana `app` folder POORA delete karein, phir is zip ka `app` folder upload karein.
Aur ye bhi purane hon to delete karein: components/ ke purane files overwrite ho jayenge, par app/ ke purane folders khud delete karne padte hain.
Is zip ke app/ me sirf ye hona chahiye: (admin) (legacy) (site) ads.txt api icon.svg not-found.jsx robots.js sitemap.js

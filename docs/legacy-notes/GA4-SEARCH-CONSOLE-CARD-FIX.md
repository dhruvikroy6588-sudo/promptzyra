Promptzyra update notes

1. Google Analytics 4
- Added the GA4 Google tag to the shared root layout using Measurement ID G-MBDBKQHL54.
- After deployment, verify with Google Tag Assistant and GA4 Realtime. Tracking cannot be confirmed until deployed on promptzyra.com.

2. Google Search Console
- Added public/googlec6cb08ecc2725a03.html.
- After deployment, open https://promptzyra.com/googlec6cb08ecc2725a03.html and confirm it shows the exact Google verification text, then click Verify in Search Console.

3. Blog card/detail cleanup
- Blog cards no longer show the prompt-kind/read-time meta line or the “Explore prompt” label.
- Blog detail pages no longer show the prompt-library category/read-time kicker or “Creative prompt guide · Updated…” subtitle.
- Prompt cards and prompt detail pages keep their prompt-specific labels.

Deploy with the existing Cloudflare/OpenNext workflow. This environment could not complete npm install, so a production build could not be run here. Verify the deployment and Tag Assistant after publishing.

# Promptzyra update package notes

## Included changes
- Prompt library now fetches 50 published prompt cards per request and offers Load More for additional batches.
- Search, category filter and sort restart the prompt query from the first batch.
- Prompt detail pages retain the full individual prompt page and request up to six related published cards in the same category.
- Blog index fetches 50 published guides at a time and offers Load More.
- Admin post loading uses batches of 500 so libraries above the Supabase default response limit can be loaded in successive requests.
- The private admin sign-in message and sidebar no longer display the admin email address.
- Admin sign-in card CSS is centered, width-constrained and responsive to prevent the narrow, clipped layout shown in the screenshot.
- `promptzyra-50-starter-cards.sql` and `.json` provide exactly 50 starter prompt records with copy-ready prompts and 50 distinct Unsplash preview URLs. Run the SQL manually in the Promptzyra Supabase SQL Editor after the schema setup; it is not run automatically by deploying the code.

## Validation
- Parsed all JavaScript/JSX files using the installed TypeScript parser: no syntax parse errors found.
- Confirmed the starter SQL contains 50 rows and 50 distinct image URLs.
- A full Next.js/Cloudflare build was not completed in this environment because dependency installation timed out. Run the configured Cloudflare build after committing these files to validate against the production environment.

## Capacity
The app does not hard-code a maximum of 5,000 images or 1,000 articles. Real capacity is determined by Supabase database/storage quotas and traffic. Each uploaded image is limited to 8 MB by the current admin UI and bucket setup. Replace starter preview URLs with images you own or are authorized to use before publishing at scale.

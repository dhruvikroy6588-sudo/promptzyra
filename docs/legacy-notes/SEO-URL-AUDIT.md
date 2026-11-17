# Promptzyra SEO URL audit and fix

## Tool URL
- Primary URL: https://promptzyra.com/gemini-watermark-remover
- Canonical and Open Graph URL updated to the primary URL.
- Sitemap uses the primary URL.
- Header and footer internal links use the primary URL.
- Legacy URL `/gemini-watermark-guide` now redirects to `/gemini-watermark-remover` to preserve existing links.

## Fixed static routes in sitemap
- `/`
- `/about`
- `/blog`
- `/gemini-watermark-remover`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/disclaimer`

## Dynamic URLs
Published Supabase posts continue to be included by the existing sitemap logic under `/blog/{slug}` or `/prompt/{slug}` according to the post kind. These routes should be checked against the production Supabase data and Search Console after deployment.

## Verification limitation
The source archive was inspected and references were updated. A full production build and live crawl were not run in this environment, so validate the deployment, sitemap, redirects, canonical tags, and every footer link after publishing.

# Promptzyra — Next.js starter

A polished prompt-blogging starter built with Next.js App Router, React and plain CSS. Includes 30 seeded guides, 60 original SVG concept-preview assets, prompt-copy actions, category filters, responsive layouts, blog detail pages, and a browser-based content dashboard.

## Requirements
- Node.js 20.9+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Important: admin is a prototype
The `/admin` screen stores edits in the current browser's `localStorage`. It is useful for UI review and local prototyping, but:
- Content is not shared between browsers/devices.
- Uploaded images are limited to 1 MB and stored as browser data URLs.
- The demo admin is not authenticated and must not be deployed publicly as a production admin.
- Seed articles are included in the source. Browser-created posts do not automatically update server-generated sitemap metadata.

Before launch, implement Supabase Auth with server-side authorization, Supabase database CRUD, Cloudflare R2 image uploads, server-side validation, and dynamic sitemap/metadata. Never expose service-role keys in client code.

## Cloudflare + GitHub deployment
1. Create a GitHub repository and push this project.
2. In Cloudflare, use the currently supported Next.js deployment path (Cloudflare Workers with the OpenNext adapter is the usual full Next.js route; Pages static export is not compatible with every dynamic Next.js feature).
3. Add your domain after you decide on it, then update `metadataBase` in `app/layout.jsx`, `app/robots.js`, and `app/sitemap.js`.
4. Set production environment variables only after adding Supabase; do not commit `.env` files.
5. Run `npm run build` locally before deploying.

## Seed content
30 English starter articles target a mix of image trends, portrait prompts, upcoming Indian festivals, 3D characters, product ads and short-form video ideas. The vector images are original concept previews labelled BEFORE/AFTER. Replace them with your own high-quality original AI outputs before relying on the site for organic traffic or ad approval. Search interest is not guaranteed and trend claims should be refreshed before publication.

## Next production steps
- Authentication and role-based access for `/admin`
- Supabase schema for posts, categories, tags and media
- Cloudflare R2 direct upload with size/type validation
- Real article SEO metadata, Open Graph image, canonical URLs
- Dynamic sitemap based on published posts
- Draft/published scheduling, slug uniqueness, content editor
- Rate limiting, input sanitization, backups and analytics

## Trend research note
Starter topic clusters were informed by a snapshot of public 2026 trend roundups and the 2026 Indian festival calendar. Recheck current search demand, regional festival dates and official sources before scheduling posts. No traffic or ranking outcome is guaranteed.


## Promptzyra branding and production checklist

This version is branded for `https://promptzyra.com`, uses a dark-only interface, includes 50 seed prompt cards and draft information pages. The seed content and vector images are starter material: review and improve every article and replace illustrative previews with your own final examples before applying for AdSense.

### Admin and storage warning
The `/admin` dashboard in this starter still stores edits in the current browser's localStorage. It is **not production-secure**, edits do not sync to other devices, and the admin route must not be exposed publicly as-is. The requested admin email is `dhruvikroy6588@gmail.com`; enforce it with Cloudflare Access (email OTP allowlist) in front of `/admin` before public deployment. Then implement server-side authorization for write APIs and connect Cloudflare D1 for content plus R2 for uploads. A client-side email check alone is not security.

### Before deployment
1. Use Node.js 20.9+ and run `npm install`, `npm run lint`, and `npm run build`.
2. Review metadata, canonical URLs, sitemap, structured data and social preview images.
3. Verify all 50 prompts and the 30 original editorial guides for usefulness, originality and accuracy.
4. Add genuine About, Contact, Privacy Policy and Terms details that match the services actually enabled.
5. Put Cloudflare Access in front of `/admin`, allow only `dhruvikroy6588@gmail.com`, and test from a logged-out browser.
6. Replace localStorage with authenticated server-side CRUD and D1/R2 before treating the dashboard as a production CMS.
7. Deploy Next.js to Cloudflare Workers using the current OpenNext adapter workflow; the existing Hello World Worker is only a domain placeholder until the app is deployed.

AdSense acceptance is not guaranteed. Thin, repeated, automatically generated, or unreviewed starter content should not be submitted as a finished publication.

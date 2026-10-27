# Promptzyra — Admin UI + Single-Image Cards + 20 Blog Drafts

Next.js App Router project for Promptzyra. Admin features: Google sign-in via Supabase Auth, exact admin email gate, Supabase-backed post CRUD, one required featured/card image per post, optional before/after fields removed from the editor, and direct Publish/Unpublish actions.

## Requirements
- Node.js 20.9+
- npm

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill the Promptzyra Supabase URL and publishable key.
3. `npm run dev`

## Before production
1. In the **Promptzyra** Supabase project, run `SETUP.md` SQL to configure the `promptzyra_posts` table, RLS and the `promptzyra-images` bucket policies. Do not run it in EPSNIX.
2. Configure Google provider and callback URLs as documented in `SETUP.md`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Cloudflare **Build environment variables**, then redeploy.
4. Commit the contents of this project directory to the root of the existing Promptzyra repository. Do not upload only the ZIP file.
5. Test login, create a draft with one featured image, publish it, and verify it appears on the public homepage or `/blog`. Test with a different Google account and ensure it cannot manage content.

## How publishing works
- A card/blog needs a title, excerpt/meta description, and one featured image. Prompt cards also require a copy-ready prompt.
- Published blog articles require at least 500 characters of original body content.
- Use the row action checkmark to publish or X to unpublish. The status is stored in Supabase.
- Public pages query `published = true`; failed database/Storage operations show an error in the admin UI.

## Important security notes
The frontend email check is a UI gate; Supabase RLS is the database enforcement. Keep RLS policies from `SETUP.md` enabled. Never expose a service-role key or OAuth client secret in frontend code or `NEXT_PUBLIC_` variables. Rotate the Google OAuth secret if it was exposed in a screenshot.

## Content notes
The SQL and JSON draft files contain exactly 20 unpublished blog drafts. They intentionally have no images; upload your own original featured image and review each article before publishing. Starter SVG concept previews are illustrative and should not be represented as real generated results. SEO ranking or AdSense approval is not guaranteed.

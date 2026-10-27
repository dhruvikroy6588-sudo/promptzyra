# START HERE — Promptzyra Admin UI

1. Back up the existing GitHub `main` branch.
2. Extract this ZIP. The project files are at the ZIP root (no nested project folder). Merge/replace those files into the root of `dhruvikroy6588-sudo/promptzyra`, then commit to `main`. Do not upload the ZIP file itself.
3. Confirm Cloudflare Build environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; then deploy.
4. In the Promptzyra Supabase project, run `SETUP.md` SQL and configure Google provider/redirect URLs. Do not run this SQL in EPSNIX.
5. For 20 blog drafts, run `promptzyra-20-blog-drafts.sql` once in Promptzyra Supabase SQL Editor. It creates drafts, not published articles.
6. Open `/admin`, sign in as `dhruvikroy6588@gmail.com`, select Prompt cards or Blog articles, create/edit content, upload one featured image, and tick Publish (or use the row action).
7. A published blog needs at least 500 characters of original content. Prompt cards require a prompt. Publish only after reviewing content and image.

If Save/Publish shows an error, copy the exact error text. Common causes are missing table columns, RLS policies not applied, missing Storage bucket/policies, incorrect build variables, or Google redirect configuration.


## Latest UI/category update
- Homepage no longer displays the "Add a prompt and image in the private admin" internal note. When no featured upload exists, it shows an editorial visual preview instead.
- Admin > Categories supports add, rename (updates posts assigned to that category), and delete (only when no posts use the category).
- For persistent category management, run the new `promptzyra_categories` SQL section in `SETUP.md` in the Promptzyra Supabase project.
- This package has not been production-built or tested against the user's live Supabase project. Deploy and test in staging/backup first.


## Starter cards and pagination
Run `promptzyra-50-starter-cards.sql` in the Promptzyra Supabase SQL Editor after the schema setup if you want 50 starter prompt cards. The public prompt library and blog list show 50 items per batch with Load More. Replace starter preview images with your own uploads from `/admin`. See SETUP.md for the database and storage capacity notes.

## R2 image upload integration (added)
- Cloudflare Worker binding required: `PROMPTZYRA_IMAGES` -> bucket `promptzyra-images`.
- R2 custom domain expected: `https://images.promptzyra.com`.
- Admin uploads are compressed in the browser to WebP (max 1800px, quality 82) and sent to `/api/admin/upload`.
- The route verifies the Supabase bearer session and restricts uploads to `dhruvikroy6588@gmail.com` before writing to R2.
- Deploy the updated repository after adding the R2 binding to `wrangler.jsonc`. Test one image in `/admin`; do not expose R2 secret keys in client variables.

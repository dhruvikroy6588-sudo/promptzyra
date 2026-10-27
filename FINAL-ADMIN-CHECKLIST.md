# Promptzyra Final Project — Start Here

This ZIP contains the complete Next.js/OpenNext project at the archive root, including the Admin route and dashboard source. It combines the single-featured-image editor, publish/unpublish actions, persistent category management, homepage empty-state visual, and exactly 20 SQL/JSON blog drafts.

## Safe deployment sequence

1. Back up the existing GitHub `main` branch before replacing or merging files.
2. Extract this ZIP and merge its contents into the repository root. Do not upload the ZIP itself. Preserve any existing project-specific changes you need.
3. Confirm Cloudflare **Build** environment variables (not only runtime variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. In the **Promptzyra** Supabase project only, review and run the SQL in `SETUP.md`. It sets up `promptzyra_posts`, admin-only row policies, the `promptzyra-images` Storage bucket/policies, and the persistent `promptzyra_categories` table/policies. Do not run it in EPSNIX.
5. If you want the 20 example blog drafts, run `promptzyra-20-blog-drafts.sql` once in the Promptzyra SQL editor. The SQL is idempotent by slug (`ON CONFLICT DO NOTHING`). Drafts remain unpublished. It contains exactly 20 records.
6. Configure Google OAuth as described in `SETUP.md`; authorized admin email in code/policies is `dhruvikroy6588@gmail.com`.
7. Commit to `main`, wait for Cloudflare build/deploy, then test `/admin`.

## Admin capabilities in this source

- Google OAuth sign-in and an email allowlist check for `dhruvikroy6588@gmail.com`.
- Separate Prompt cards, Blog articles, and Categories tabs.
- Create/edit/delete content, draft/publish/unpublish, search, and one featured image upload per item.
- Category add/rename/delete. Renaming updates posts; deleting is blocked while posts still use that category.
- Publish validation and explicit Supabase error messages.

## Required live verification

This source package has not been successfully production-built or tested against your live Cloudflare/Supabase deployment in this session. After deploy, verify:
- Authorized Google account can sign in; a different account is denied.
- Create a draft prompt with one image, save, edit, publish, then confirm it appears publicly.
- Create a blog with at least 500 characters of original article body and one image; save and publish.
- Add, rename, and delete an unused category.
- Confirm another account cannot write to the posts table or upload/delete images.

Never place a Supabase service-role/secret key in frontend code or any `NEXT_PUBLIC_*` variable. Never overwrite your existing repository without a backup.

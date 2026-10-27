# Promptzyra — Full Project (Admin + Supabase)

This is the full Next.js project source, not just the blog drafts ZIP.

## Important: keys are not bundled
For security, no Supabase publishable key or Google OAuth secret is embedded. Configure these Cloudflare **Build environment variables** for the production build:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://hlcxuerdoxgytykiwmwk.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = the publishable key from that same Promptzyra Supabase project

Then trigger a **new build**. These public variables are embedded by Next.js at build time; runtime-only variables are not a substitute.

## Admin and access control
- Admin route: `/admin`
- Allowed admin email in code and SQL policies: `dhruvikroy6588@gmail.com`
- Google OAuth provider must be configured in Supabase with callback `https://hlcxuerdoxgytykiwmwk.supabase.co/auth/v1/callback`.
- Run the SQL in `SETUP.md` in the Promptzyra Supabase project only. Do not run it in EPSNIX.
- The `promptzyra-images` Storage bucket and policies are created by that SQL.

## Honest status
This ZIP contains the project source and setup instructions. It has not been verified against your live Cloudflare deployment or your private Supabase/Google OAuth settings, so a successful live login cannot be guaranteed from the ZIP alone. Do not upload the ZIP file itself as the app; extract it and deploy the project files to the repository.

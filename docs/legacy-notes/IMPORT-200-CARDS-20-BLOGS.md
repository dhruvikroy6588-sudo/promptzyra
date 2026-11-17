# Promptzyra installation

1. Back up GitHub repository and Supabase database.
2. Replace source files from this ZIP in the GitHub repo and deploy.
3. In Supabase SQL Editor, run `promptzyra-200-starter-cards.sql` after existing schema.
4. Then run `promptzyra-20-published-blogs.sql` to make the 20 starter articles visible on `/blog` and at the bottom of the homepage. Existing articles with matching slugs will be marked published and their demo images replaced.
5. Replace every placeholder image through `/admin` with your own licensed images. These are external demo URLs, not owned original artwork.
6. Check Supabase RLS and storage policies before launch.

This project is an original layout inspired by general discovery patterns, not a pixel-identical copy of PromptPlum. The complete Cloudflare production build, Google OAuth and live database have not been tested here. 200 records are generated as 50 base concepts with three distinctly directed variations; review and refine editorially before launch.

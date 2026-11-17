Promptzyra admin/blog update notes

Included changes:
- Blog editor uses blog-specific fields: Title (240 chars), slug, category, excerpt (400 chars), article content, and tags. It does not show the copy-ready prompt field for blogs.
- Blog featured images are optional so they can be added manually later; prompt cards still require a featured image.
- Category manager supports add/rename/delete and category choices are shared by content entries. Blog listing now has category filter chips based on saved categories.
- Public header has a light/dark mode toggle with saved preference.
- Existing lib/seo-guides.js / lib/seed-posts.js includes the starter blog guide content; database-backed publishing still depends on the project's existing Supabase setup and seed SQL.

Deployment reminder: this ZIP is code only. Merge the project files into the GitHub repository and deploy using the project's existing Cloudflare build/deploy workflow. Check the production build and admin flow after deployment; the runtime environment was not available here for a complete Next.js/Cloudflare build test.

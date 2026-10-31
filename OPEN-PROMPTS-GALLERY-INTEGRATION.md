# Promptzyra Visual Image Prompt Gallery

This update adds a first-party visual image prompt gallery at `/image-prompts` inspired by the discovery workflow described by the Open Prompts project:
https://github.com/rudy2steiner/open-prompts

The gallery implementation in this project is newly written for Promptzyra's existing Next.js, Supabase and Cloudflare setup. It does not import Open Prompts source files or require its separate authentication, database, provider API, or generation service. The referenced project describes itself as Apache-2.0 licensed; consult its repository LICENSE before reusing any of its source code directly.

## Included
- Responsive visual gallery with lazy-loaded preview images.
- Search across title, excerpt, prompt, category, keywords and tags.
- Model filters for GPT Image, Gemini, Midjourney, Flux and Stable Diffusion. Model classification uses available prompt text and metadata; entries without an explicit model label default to GPT Image for browsing.
- Tag filter generated from existing category, tags and keywords data.
- Prompt detail links to the existing `/prompt/[slug]` page, where the complete prompt and copy workflow already exist.
- Copy action on gallery cards when a prompt is present.
- Link to the existing `/image-prompt-generator` for composing a new prompt.
- Homepage entry point, header/footer navigation and sitemap URL.

## Data requirements
The gallery reads published non-blog rows from the existing `promptzyra_posts` table. It uses existing fields only: `id`, `title`, `slug`, `excerpt`, `prompt`, `category`, `tags`, `keywords`, `thumbnail`, `image1`, `image2`, `kind`, and `updated_at`. No migration or new environment variable is required.

For best model filtering, include model names such as GPT Image, Gemini, Midjourney, Flux or Stable Diffusion in the post title, category, keywords, tags or prompt metadata. Add a featured image using `thumbnail`, `image2` or `image1`.

## Performance and SEO
- The gallery requests at most 180 published prompt rows and renders 30 at a time.
- Preview images use lazy loading and async decoding.
- Search and filters run in the browser over the bounded result set.
- `/image-prompts` has a canonical URL, page metadata and is included in `app/sitemap.js`.
- The existing prompt detail pages retain their own metadata and structured data.

## Verification
A full production build should be run in the project's normal environment after installing dependencies. This container could not complete `npm install` within the available time, so a successful production build has not been claimed.

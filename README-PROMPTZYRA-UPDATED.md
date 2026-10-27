# Promptzyra updated package

This is the updated Next.js 15 / Cloudflare OpenNext project. It adds Supabase Google authentication in `/admin`, email allowlisting for `dhruvikroy6588@gmail.com`, Supabase database CRUD with RLS assumptions, Storage image uploads, broader home-page search across prompt text and keywords, combined category filtering, sorting, and a clear before/after image workflow.

Read `SETUP.md` before deploying. The code is not live until you commit/upload it to the existing Promptzyra repository and Cloudflare completes a successful build. Supabase SQL/storage policies and build-time environment variables are required.

Gemini watermark page is a guide, not an automatic watermark-removal engine. No third-party remover library is bundled or represented as verified.


## Routes added in the UX update
- `/` — prompt library with search, categories and sorting.
- `/prompt/[slug]` — prompt detail page with copy/share, tags, suggested settings, before/after visuals, usage steps, tips, FAQ and related prompts.
- `/blog` — editorial guide index.
- `/blog/[slug]` — individual SEO guide with metadata and Article structured data.
- `/gemini-watermark-guide` — educational guidance page; it is not an automatic watermark remover.

The top navigation has exactly three primary links: Prompt Library, Blog, and Gemini Watermark Remover.


## Admin-uploaded content only
The public prompt and blog listings load published rows from the Promptzyra Supabase table. Bundled demo SVG images were removed. Upload a main image in Admin; that URL is used for the card thumbnail and detail hero. Before/after uploads are optional and displayed only when both are provided. Blog entries require original body content (at least 500 characters to publish) and can use `## Heading` lines plus blank lines between paragraphs.

## Verification status
Source files and ZIP archive were updated, but a full production build could not be confirmed in this environment because dependency installation timed out. Follow SETUP.md and run the build before deploying.


## Google Analytics 4 + Google Search Console

Set these environment variables in Cloudflare Workers (Settings → Variables and Secrets), then redeploy:

- `NEXT_PUBLIC_GA_ID` — your GA4 Measurement ID, e.g. `G-XXXXXXXXXX`.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — the verification token from Search Console's HTML tag method (paste only the `content` token, not the full meta tag).

In Google Analytics, create a GA4 web data stream for `https://promptzyra.com` and copy its Measurement ID. In Google Search Console, add `https://promptzyra.com` as a URL-prefix property, choose HTML tag verification, and copy the token from `content="..."`. Add both values in Cloudflare and redeploy. Then verify the property in Search Console. Analytics collection starts only when the GA ID is configured. Search Console verification does not itself submit the sitemap; submit `https://promptzyra.com/sitemap.xml` in Search Console after verification.

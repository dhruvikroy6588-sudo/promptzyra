# Promptzyra detail-page update

This update uses common prompt-library UX patterns observed on PromptPlum's public library and sample detail page, but does not copy its text, visual assets, or exact page layout.

## Improvements
- Larger, predictable 4:3 card images with clear cover cropping and responsive behavior.
- Prompt detail page now has a visual preview, category/tool/format summary, before/after panels, a step-by-step usage section, copy-ready prompt, creator tips, suggested settings, FAQs, and related prompts.
- Added anchor navigation for the guide sections.
- Added Article JSON-LD, canonical URL, Open Graph article metadata, and Twitter large-image metadata for the seed prompt routes.

## Important limitations
- The SVG images shipped in `public/images/` are concept placeholders, not real AI-generated photo outputs. Replace them with original generated/owned image assets in the admin before production publishing; don't label placeholder visuals as tested results.
- This is a source update only. A production build could not be run here because dependency installation timed out. Deploy only after running `npm install` and `npm run build` in your own environment, then test desktop/mobile, copy/share, database, and authorization.
- Database-created slugs require server-side routing/metadata integration before they can be guaranteed to receive static SEO metadata. This package's existing detail route still derives its metadata from bundled seed content.

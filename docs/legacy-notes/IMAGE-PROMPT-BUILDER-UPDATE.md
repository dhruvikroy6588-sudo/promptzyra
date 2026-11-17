# Promptzyra Image Prompt Builder Update

## Added
- New public route: `/image-prompt-generator`
- Browser-only structured image prompt builder with subject, details, target tool, visual style, mood, lighting, camera/viewpoint, composition, aspect ratio, colors, background, and negative prompt controls.
- Live prompt preview and copy-to-clipboard action (with a legacy clipboard fallback).
- No AI API, external model call, API key, database table, or additional npm dependency is required for the builder.
- Added navigation/footer links and a homepage entry point.
- Added page metadata, canonical URL, Open Graph metadata, WebApplication JSON-LD, and sitemap entry.

## Preserved
- Existing Supabase prompt and blog data access.
- Existing admin and R2 upload routes/bindings.
- Existing GA4 Measurement ID and Search Console verification HTML file.
- Existing visual theme and brand colors.

## Verify after deployment
1. Open `/image-prompt-generator`.
2. Enter a subject and change style/lighting/camera options.
3. Confirm the preview updates as fields change.
4. Click **Copy complete prompt** and paste into a text editor.
5. Check `/sitemap.xml` for `/image-prompt-generator`.

The production build could not be run in this environment because dependency installation timed out. Run `npm install` and `npm run build` locally or in the deployment environment before publishing.

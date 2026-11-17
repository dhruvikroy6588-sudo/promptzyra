# Admin guide
URL: `/admin`. Only the Google account in `pz_is_admin()` (and `NEXT_PUBLIC_ADMIN_EMAIL`) can read drafts or write. Anyone else is denied by the database itself.

**Prompts / AI tools**: search, filter by status/category, bulk select → mark reviewed / publish / unpublish / delete; Duplicate; edit every field including SEO title/description and FAQ.
**Status**: draft → reviewed → scheduled → published. Scheduled items go live automatically when their time passes.
**Daily routine**: *Publish next N reviewed now* or *Schedule all reviewed* (N per day from a start date).
**Blog**: Markdown editor with preview, featured image upload (auto-compressed to WebP → R2), SEO fields, FAQ (Q:/A:), schedule, publish/unpublish, delete.
**Categories**: add, rename, reorder, write intro text (shown on the public category page). A category cannot be deleted while items use it.
**Import drafts**: JSON or CSV (lists separated with `|`). Duplicate slugs are skipped. Always lands as draft.
**Settings**: ads.txt (after AdSense approval), show/hide homepage sections.
**Old image-card admin**: `/admin/legacy`.

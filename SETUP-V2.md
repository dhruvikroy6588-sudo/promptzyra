# Promptzyra v2 — Setup (15 minutes)

## 1. Supabase (one time)
1. Supabase → **SQL Editor** → open `supabase/v2-setup.sql` → paste → **Run**.
   - Single admin email is set at the top (`pz_is_admin()`): `dhruvikroy6588@gmail.com`. To change it, edit that line and re-run.
   - It creates `pz_categories`, `pz_prompts`, `pz_tools`, `pz_settings`, security rules, counters and seeds the categories.
2. Authentication → Providers → Google must already be on (same as before). Add `https://promptzyra.com/admin` to Redirect URLs.

## 2. Cloudflare variables
Cloudflare dashboard → Workers & Pages → your project → **Settings**. Add the four variables below in BOTH places: **Build → Variables and secrets** (NEXT_PUBLIC_* values are baked in at build time, so this one is essential) and **Variables and secrets** (runtime). Then trigger a new deploy.
| Name | Value |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | (same as before) |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | (same as before) |
| NEXT_PUBLIC_ADMIN_EMAIL | dhruvikroy6588@gmail.com |
| NEXT_PUBLIC_SITE_URL | https://promptzyra.com |

Never put the `service_role` key in GitHub or in any `NEXT_PUBLIC_` variable. This project does not need it.
The R2 image binding (`PROMPTZYRA_IMAGES`) stays as in `wrangler.jsonc`.

## 3. Deploy
Push to GitHub as before. Cloudflare builds it.

## 4. Tool drafts: what is already written
`content/seed-tools.json` now has a short original description (~80 words), steps, strengths, limits and alternatives for all 52 tools, with **no exact prices**. Pricing type is a general guess and `last_checked` is empty on purpose. Before publishing each tool: open the official site, confirm the pricing type, add 1–2 paragraphs from your own testing (this also makes the page unique), set *Last checked* to today, then mark reviewed.

## 5. First content
Open `/admin` → sign in with the admin Google account → **Import drafts**:
- Prompts → paste `content/seed-prompts.json` (50 drafts)
- AI tools → paste `content/seed-tools.json` (52 drafts)
- Blog → paste `content/seed-blog-drafts.json` (5 drafts)

Everything arrives as **draft**. Read, improve, mark **reviewed**, then use *Publish next 5* or *Schedule all reviewed*.

## 6. Search Console
Add `https://promptzyra.com/sitemap.xml` in Google Search Console.

## Local commands
```
npm install
npm run dev
npm run build
# resume thumbnails (only if you change templates):
npx next start -p 3111 &  node scripts/make-thumbs.mjs http://localhost:3111
```

---
## UPDATE (godofprompt-style features)
Aapne v2-setup.sql pehle hi run kar di hai, isliye Supabase SQL Editor me ye 3 files ek-ek karke run karein (safe, dobara run kar sakte hain):
1. supabase/v2-patch-0-newsletter.sql  (newsletter subscribers)
2. supabase/v2-patch-1-prompts.sql     (prompt type text/image, example image, subcategory)
3. supabase/v2-patch-2-blog.sql        (blog image alt, featured post)
Fresh install ke liye ye teeno v2-setup.sql ke end me already merged hain.
Phir code GitHub pe push -> Cloudflare redeploy.

---
## UPDATE 2 — Blog 200 + Photo Prompts
Supabase SQL Editor me ye bhi run karein (ek-ek karke, safe to re-run):
4. supabase/v2-patch-3-blog-categories.sql  (AI for Teachers category)
5. supabase/v2-patch-4-photo.sql            (Photo Prompts table + categories)
Phir /admin me:
- Import drafts -> Blog -> content/blog-200.json   (10 live + 190 draft)
- Import drafts -> Photo prompts -> content/seed-photo-prompts.json  (40 drafts, placeholder covers)
- Photo prompts tab me har prompt ki image asli example image se badlein (upload button), phir Publish.
Detailed: docs/BLOG-200-GUIDE.md

---
## UPDATE 3 — Redesign (sidebar, admin, R2 sync)
Supabase SQL Editor me run karein: supabase/v2-patch-5-admin.sql  (og_image column; safe to re-run)
- Admin sections: Overview, Prompts, Photo Prompts, AI Tools, Blog, Categories, Import Drafts, Subscribers, Settings.
- /admin/legacy ab /admin pe redirect hota hai.
- Delete karne par Supabase row + R2 image dono delete hoti hain. Purani orphan images: Admin -> Settings -> Storage cleanup.
- Contact email: contantnewshour@gmail.com (lib/site.js CONTACT_EMAIL se sab pages me).
- AdSense se pehle: Search Console me sitemap submit karein, ads.txt Admin -> Settings me daalein, drafts review karke hi publish karein.

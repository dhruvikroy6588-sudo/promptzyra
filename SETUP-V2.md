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

---
## UPDATE 4 — Skills, AI Tools upgrade, sidebar layout
Supabase SQL Editor me ye 3 files ek-ek karke run karein (is order me):
- supabase/v2-patch-6-skills.sql          (Skills table + 9 skill categories)
- supabase/v2-patch-7-tools.sql           (tools ke naye fields + tool submissions)
- supabase/v2-patch-8-photo-cleanup.sql   (sirf "AI Photo Trends" category)
Phir /admin -> Import Drafts me:
- Skills  -> content/seed-skills.json        (40 skills, draft)
- AI tools -> content/seed-tools-extra.json  (99 naye tools, draft; pehle seed-tools.json bhi, agar nahi kiya)
Sab draft me aate hain. Tools aur skills ko ek baar padh/verify karke hi Publish karein.
NOTE: seed-tools-extra.json ke kuch hisse (3rd paragraph, kuch FAQ, SEO text) template jaise hain —
publish se pehle har tool me apna 1-2 line ka asli anubhav/detail jodein aur official site se pricing/URL verify karein.
Photo Prompts admin me ab sirf: Image, Title, Tags, Description, Prompt.

## Update 5: AI Courses, Agents, Commands, Settings, Hooks, MCPs, Mods, Plugins, 1000+ AI tools
Run in the Supabase SQL editor (safe to re-run): `supabase/v2-patch-9-components.sql` and `supabase/v2-patch-10-courses.sql`.
Then /admin -> Import Drafts and import these files (everything arrives as DRAFT, nothing goes live by itself):
1. AI tools: `content/seed-tools-more.json` (889 tools; the earlier 151 are in seed-tools.json and seed-tools-extra.json).
2. "Agents/Commands/MCPs…": `content/seed-components.json` (537 items: agents, commands, settings, hooks, MCPs, mods, plugins).
3. "AI Courses": `content/seed-courses.json` (150 free/paid courses and YouTube resources).
Before publishing anything: open the link, check the price/plan on the official site, and fix wording. Tools and courses were written without live web access (last_checked = "unverified"), pricing is "Unknown" unless certain. Publish a few per day from the admin tab (Mark reviewed -> Publish now/Schedule).
The "stars" field is empty on purpose: enter only a number you checked on GitHub.
Blog: in the editor press "Auto-fill SEO fields from content" (title, description, slug, tags, read time, image alt); empty fields are also filled automatically when you save.

## Update 6: aitmpl-style components (MIT)
Import `content/seed-aitmpl-agents.json`, `seed-aitmpl-commands.json`, `seed-aitmpl-mcps-hooks-settings-mods.json` with the "Agents/Commands/MCPs…" button. Source: github.com/davila7/claude-code-templates (MIT). Credit it on your About page: "Some components are from Claude Code Templates by Daniel Ávila, MIT License." These are copied components: add your own description/use cases and publish a few per day.
Admin: no more "reviewed" step. Use "Save as draft" or "Save & publish".
Design: new emerald/gold palette, flat bordered cards, mono labels, Playfair Display headings.

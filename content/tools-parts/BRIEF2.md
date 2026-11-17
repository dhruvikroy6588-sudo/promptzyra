# Brief: AI tools directory batch (accuracy first)
Write a JSON array to your output file. Each entry has EXACTLY these keys (same as content/seed-tools-extra.json, read 1 entry there first):
slug, name, category, website_url, pricing, tagline, best_for, platforms[], description, use_steps[4], pros[3-4], cons[2], alternatives[2-3 slugs of other tools], tags[4-5], features[4-5], use_cases[3-4], pricing_details, faq[{q,a} x3], seo_title, seo_description, status:"draft", last_checked:"2026-11".
- category MUST be one of: audio, career, chat-assistants, coding, design, image, marketing, productivity, research, study, video, writing.
- pricing one of: Free, Freemium, Paid, Free trial, Open source, Unknown (use Unknown/"check the official site" whenever you did not verify).
- ONLY include tools that REALLY exist and that you confirmed via WebSearch/WebFetch (official site found). website_url must be the real official homepage. NEVER invent a tool, URL, price, funding, user count, or award. No "best/#1" claims. If a tool shut down or you are unsure, skip it.
- Write original text: description 2 short paragraphs (~110-160 words total) specific to what the tool does (not generic filler), neutral tone, end with a note to check the official site for current plans. Each entry must differ meaningfully from the others (no copy-paste paragraphs).
- Do not duplicate any slug in /tmp/existing-tool-slugs.json (read it first; ~151 slugs). Keep slugs kebab-case and unique inside your file.
- You may do many searches in the same turn to be efficient; write the file in 2-3 chunks (python merge) to avoid giant single outputs; validate with python json + check required keys + category/pricing values before finishing.
- Only touch your own output file. Final reply: 2 lines (count written, any skipped).

## UPDATE (supersedes the verification rule): web fetch/search are blocked or budget-exhausted for everyone
Do NOT spend time trying to fetch. Instead write entries from your own knowledge, but ONLY for tools you are highly confident exist (as of 2025) AND whose official domain you know for certain. Rules:
- pricing: use "Unknown" unless you are certain (then Free / Freemium / Paid / Open source). pricing_details must say plans change and to check the official site. No numbers, no prices, no funding, no user counts, no awards, no "best".
- Avoid describing specific features you are not sure about; describe the category-level job of the tool (what it is for) in plain words, and list features conservatively.
- set "last_checked":"unverified" and keep status "draft". The site owner will verify each URL before publishing.
- Skip tools that may have shut down or rebranded recently.

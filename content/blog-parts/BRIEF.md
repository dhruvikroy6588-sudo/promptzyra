# Blog writing brief (Promptzyra — education-focused AI prompts, AI tools, resume builder, free tools)
Write ORIGINAL, genuinely useful, long-form evergreen articles in clear English for a global audience (students, teachers, job seekers, creators, professionals). Goal: rank for real search intent (how-to, best-practice, comparison, template, checklist, "what is") and satisfy Google helpful-content + AdSense quality rules.

Output: ONE JSON file (array of 20 objects) at the path you are given. Each object:
{ "slug": kebab-case, max 70 chars, keyword-led,
  "title": 50-65 chars, specific, includes the main keyword, no clickbait,
  "category": EXACT category name given to you,
  "excerpt": 140-160 chars (meta-description quality),
  "seo_title": <=60 chars (can equal title), "seo_description": 145-160 chars,
  "tags": [5-7 lowercase keywords/phrases],
  "read_time": "N min read" (words/200),
  "content": markdown, 1100-1500 words, NO H1 (title is shown separately). Structure: short intro (answer the query in the first 2 sentences), 5-8 "## " sections, "### " subsections where useful, bullet/numbered lists, at least one copy-ready example prompt or template in a fenced block or blockquote where relevant, a "## Common mistakes" section, and a short closing "## Next steps" that links 2-3 internal pages using markdown links ONLY from: /prompts, /prompts/category/students, /prompts/category/writing, /prompts/category/careers, /prompts/category/productivity, /prompts/category/education, /ai-tools, /prompt-builder, /study-planner, /resume-builder, /resume-templates, /ats-resume-checker, /cover-letter-builder, /tools, /blog.
  "faq": [ {"q":..., "a":...} x3-4 ] (a: 30-60 words each, real questions people search),
  "image_kw": 2-4 words describing a simple vector illustration concept for the cover (no text in the image) }
Rules: no fabricated statistics, studies, quotes, awards, user counts or testimonials; no claims about current prices, version numbers or "latest" features of products (keep evergreen; tell readers to check the official site); no medical/legal/financial guarantees; never encourage cheating or plagiarism — promote responsible use; do not copy from any website; vary sentence openings, avoid filler and keyword stuffing; each article must have a distinct angle and a unique slug (no duplicates inside your file; avoid near-duplicate topics). Use "you" voice, practical and professional. Valid JSON only (escape quotes/newlines properly — write the file with Python json.dump from a script so it is always valid). After writing, run a Python check that every item has all keys, word counts are 1000+, slugs unique, and print the counts. Do not touch any other file. Final reply: one line with the file path and item count.

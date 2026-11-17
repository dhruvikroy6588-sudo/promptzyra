# 200 blog posts — kaise use karein

File: `content/blog-200.json` (200 articles, har ek 1000-1300 words, FAQ + SEO title/description + tags + cover image)
Covers: `public/blog/<slug>.webp` (code ke saath deploy hote hain, alag upload nahi karna)

## Steps
1. Supabase SQL Editor me run karein (agar abhi tak nahi kiya): `supabase/v2-patch-2-blog.sql` aur `supabase/v2-patch-3-blog-categories.sql` (nayi category "AI for Teachers").
2. Code GitHub pe push -> Cloudflare redeploy (taaki images live ho).
3. /admin -> Import drafts -> Blog -> `content/blog-200.json` choose -> Import.
   - 10 posts live honge (flag `go_live`), baaki 190 DRAFT me.
   - Ek baar hi import karein (dobara karne par duplicate slugs skip ho jaate hain).
4. Roz 5 publish: Admin -> Blog -> drafts select -> "Publish" ya "Schedule N per day" (5/day) use karein.

## Live hone wale 10
what-is-prompt-engineering-beginners-guide (featured), role-context-task-format-prompt-framework, ai-flashcards-prompts-for-studying, use-ai-for-assignments-without-cheating, ats-friendly-resume-guide, star-method-interview-answers, how-to-choose-an-ai-tool-for-your-needs, ai-chat-assistants-explained-how-to-pick-one, ai-daily-planning-prompts, ai-lesson-planning-for-teachers

## Dhyan dein
- Kuch topics aapas me milte-julte hain (jaise prompt library, fact-check, templates with variables). Publish karne se pehle dekh lein; ek jaisa topic ek saath publish na karein, ya ek ko merge/delete kar dein.
- Publish se pehle har article ek baar padh lein aur apna experience/example jodein — AdSense ke liye original value zaroori hai.
- Covers illustration-style (text-free vector) hain; zaroorat ho to admin me thumbnail badal sakte hain.

import json, re
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
T=[]
def t(name,cat,url,pricing,tag,best,plat=("Web",),desc=""):
    T.append(dict(slug=slug(name),name=name,category=cat,website_url=url,pricing=pricing,tagline=tag,best_for=best,platforms=list(plat),
      description=desc or f"{name} is {tag[0].lower()+tag[1:]} EDIT THIS: write 150–250 original words — what it does, who it suits, how you used it, what surprised you. Verify features and pricing on the official site before publishing.",
      use_steps=[],pros=[],cons=[],alternatives=[],tags=[],status="draft"))
# name, category, url, pricing type (verify!), tagline, best for
for r in [
('ChatGPT','chat-assistants','https://chatgpt.com','Freemium','General-purpose AI assistant for writing, learning and analysis.','Everyday questions, drafting and study help',('Web','iOS','Android','Desktop')),
('Claude','chat-assistants','https://claude.ai','Freemium','AI assistant known for long documents and careful writing.','Reading long texts and structured writing',('Web','iOS','Android','Desktop')),
('Google Gemini','chat-assistants','https://gemini.google.com','Freemium','Google’s AI assistant connected to Google apps.','People who live in Google Workspace',('Web','iOS','Android')),
('Microsoft Copilot','chat-assistants','https://copilot.microsoft.com','Freemium','AI assistant built into Microsoft products and the web.','Microsoft 365 users',('Web','Windows','iOS','Android')),
('Perplexity','research','https://www.perplexity.ai','Freemium','AI answer engine that cites its sources.','Quick research with links to check',('Web','iOS','Android')),
('Grok','chat-assistants','https://grok.com','Freemium','AI assistant from xAI with live social data.','Following fast-moving topics',('Web','iOS','Android')),
('DeepSeek','chat-assistants','https://www.deepseek.com','Freemium','Open-weights AI assistant focused on reasoning and coding.','Coding and maths questions',('Web','iOS','Android')),
('Grammarly','writing','https://www.grammarly.com','Freemium','Grammar, tone and clarity checker.','Polishing emails and essays',('Web','Browser extension','Desktop')),
('QuillBot','writing','https://quillbot.com','Freemium','Paraphrasing, summarising and grammar tools.','Rewording and summarising text',('Web','Browser extension')),
('Notion AI','productivity','https://www.notion.com','Paid','AI features inside the Notion workspace.','Notes and project docs in Notion',('Web','Desktop','Mobile')),
('Otter.ai','productivity','https://otter.ai','Freemium','Meeting transcription and summaries.','Recording and summarising meetings',('Web','iOS','Android')),
('Fireflies.ai','productivity','https://fireflies.ai','Freemium','AI meeting recorder and note taker.','Teams that meet on video calls',('Web',)),
('Zapier','productivity','https://zapier.com','Freemium','Connects apps and automates workflows.','Automating repetitive tasks without code',('Web',)),
('Canva','design','https://www.canva.com','Freemium','Design tool with AI image and writing features.','Posters, slides and social graphics',('Web','iOS','Android','Desktop')),
('Gamma','design','https://gamma.app','Freemium','AI-assisted presentations and documents.','Quick slide decks',('Web',)),
('Beautiful.ai','design','https://www.beautiful.ai','Paid','Presentation software with smart layouts.','Clean business slides',('Web',)),
('Figma','design','https://www.figma.com','Freemium','Collaborative interface design tool.','UI design and prototypes',('Web','Desktop')),
('Midjourney','image','https://www.midjourney.com','Paid','AI image generator known for artistic output.','Concept art and stylised images',('Web','Discord')),
('Adobe Firefly','image','https://firefly.adobe.com','Freemium','Adobe’s generative AI for images and effects.','Creators using Adobe apps',('Web','Desktop')),
('Leonardo AI','image','https://leonardo.ai','Freemium','AI image generation with style controls.','Game and concept art',('Web',)),
('Ideogram','image','https://ideogram.ai','Freemium','AI image generator good at text in images.','Posters and logos with lettering',('Web',)),
('Remove.bg','image','https://www.remove.bg','Freemium','Removes image backgrounds automatically.','Product and profile photos',('Web','API')),
('Upscayl','image','https://upscayl.org','Open source','Free open-source AI image upscaler.','Enlarging low-resolution images',('Desktop',)),
('Runway','video','https://runwayml.com','Freemium','AI video generation and editing suite.','Short AI video clips',('Web',)),
('Pika','video','https://pika.art','Freemium','Text and image to video generator.','Short social clips',('Web',)),
('CapCut','video','https://www.capcut.com','Freemium','Video editor with auto-captions and AI tools.','Short-form video editing',('Web','Desktop','iOS','Android')),
('Descript','video','https://www.descript.com','Freemium','Edit video and audio by editing text.','Podcasts and talking-head video',('Web','Desktop')),
('ElevenLabs','audio','https://elevenlabs.io','Freemium','Realistic AI voice generation.','Voice-overs and narration',('Web','API')),
('Whisper (OpenAI)','audio','https://github.com/openai/whisper','Open source','Open-source speech recognition model.','Transcribing audio offline',('CLI',)),
('Audacity','audio','https://www.audacityteam.org','Open source','Free open-source audio editor.','Recording and cleaning audio',('Desktop',)),
('GitHub Copilot','coding','https://github.com/features/copilot','Paid','AI pair programmer inside your editor.','Developers writing code daily',('VS Code','JetBrains')),
('Cursor','coding','https://www.cursor.com','Freemium','AI-first code editor.','Working across a codebase with AI',('Desktop',)),
('Replit','coding','https://replit.com','Freemium','Browser-based coding environment with AI help.','Learning and quick prototypes',('Web',)),
('Codeium (Windsurf)','coding','https://windsurf.com','Freemium','AI coding assistant and editor.','Autocomplete and chat in the IDE',('Desktop',)),
('Google Colab','coding','https://colab.research.google.com','Freemium','Free hosted notebooks for Python and ML.','Data science practice',('Web',)),
('NotebookLM','study','https://notebooklm.google.com','Freemium','Chat with your own documents and get summaries.','Studying from your own sources',('Web',)),
('Quizlet','study','https://quizlet.com','Freemium','Flashcards and study modes.','Memorising terms',('Web','iOS','Android')),
('Anki','study','https://apps.ankiweb.net','Open source','Spaced-repetition flashcards.','Long-term memorisation',('Desktop','Android','iOS')),
('Khan Academy (Khanmigo)','study','https://www.khanacademy.org','Freemium','Free lessons with an AI tutor option.','School subjects and test prep',('Web','iOS','Android')),
('Duolingo','study','https://www.duolingo.com','Freemium','Gamified language learning.','Daily language practice',('Web','iOS','Android')),
('Wolfram Alpha','study','https://www.wolframalpha.com','Freemium','Computational knowledge engine for maths and science.','Step-by-step maths and data answers',('Web','iOS','Android')),
('Elicit','research','https://elicit.com','Freemium','AI research assistant for academic papers.','Literature search and summaries',('Web',)),
('Consensus','research','https://consensus.app','Freemium','Search engine for scientific papers.','Finding evidence in studies',('Web',)),
('Scholarcy','research','https://www.scholarcy.com','Freemium','Summarises research articles into flashcards.','Reading papers faster',('Web',)),
('Zotero','research','https://www.zotero.org','Open source','Free reference manager.','Collecting and citing sources',('Desktop','Browser extension')),
('Semrush','marketing','https://www.semrush.com','Paid','SEO and marketing research suite.','Keyword and competitor research',('Web',)),
('Ubersuggest','marketing','https://neilpatel.com/ubersuggest','Freemium','Keyword ideas and basic SEO audits.','Small sites starting with SEO',('Web',)),
('Google Search Console','marketing','https://search.google.com/search-console','Free','Free tool to monitor your site in Google Search.','Every website owner',('Web',)),
('Jasper','marketing','https://www.jasper.ai','Paid','AI writing platform for marketing teams.','Brand-consistent marketing copy',('Web',)),
('Resume Worded','career','https://resumeworded.com','Freemium','Resume and LinkedIn review tool.','Quick resume feedback',('Web',)),
('Jobscan','career','https://www.jobscan.co','Freemium','Compares your resume with a job description.','ATS keyword matching',('Web',)),
('Interview Warmup (Google)','career','https://grow.google/certificates/interview-warmup','Free','Practise interview questions with Google.','Interview practice',('Web',)),
]: t(*r)
for x in T:
    if x['name'] in ('Google Search Console','Interview Warmup (Google)'): x['pricing']='Free'
json.dump(T,open('content/seed-tools.json','w'),indent=1,ensure_ascii=False); print(len(T),'tools')
B=[
('How to Use AI for Studying Without Cheating','ai-for-students','A practical guide for students on using AI to learn faster while following academic integrity rules.',
"""## Start with your school's rules
Policies differ. Read your course or school guidance first, and when in doubt ask your teacher. Using AI to explain ideas is very different from submitting AI text as your own work.

## Ways AI helps learning
- **Explain it simply.** Ask for an explanation and an example, then restate it in your own words.
- **Quiz yourself.** Ask the assistant to ask you questions one at a time and correct you.
- **Plan revision.** Give subjects and dates and ask for a schedule, then adjust it to your life.
- **Get feedback, not answers.** Ask what is unclear in your draft instead of asking for a rewrite.

## Habits that keep you safe
- Verify facts with your textbook or a trusted source.
- Keep a short note of how you used AI.
- Never paste personal data.

Try the [study planner](/study-planner) and the [student prompts](/prompts/category/students)."""),
('How to Write a Resume Bullet That Shows Results','careers-resume','Turn job duties into achievements with a simple formula and examples.',
"""## The formula
Action verb + what you did + measurable result.

## Before and after
- Before: Responsible for customer emails.
- After: Answered 60+ customer emails daily and reduced average reply time from 8 hours to 3.

## No numbers?
Use scope (how many people, projects, or how often), time saved, or quality feedback. Never invent figures.

## Next step
Build your resume in the free [resume builder](/resume-builder) and check it with the [ATS checker](/ats-resume-checker)."""),
('Prompt Basics: The Five Parts of a Good Prompt','prompt-engineering','Role, task, context, format and rules — a simple structure for clearer AI answers.',
"""## 1. Role
Tell the AI who to act as, for example a patient tutor.

## 2. Task
Say exactly what you want done.

## 3. Context
Give background the AI cannot guess: your level, audience, constraints.

## 4. Format
Ask for a table, list, word limit or steps.

## 5. Rules
List what to avoid and ask it to flag uncertainty.

Use the [prompt builder](/prompt-builder) to practise."""),
('ATS Resumes: What Applicant Tracking Systems Actually Read','careers-resume','Understand how resume software parses your document and how to avoid common mistakes.',
"""## What an ATS does
It stores applications and tries to read your resume into fields. Simple, text-based layouts are the safest.

## Practical tips
- Use standard headings (Experience, Education, Skills).
- Avoid text inside images and unusual symbols.
- Match keywords from the job post when they truthfully apply.

See our [ATS-friendly templates](/resume-templates/ats-friendly)."""),
('How to Choose an AI Tool: Five Questions to Ask First','ai-tools-guides','A checklist for picking an AI tool that fits your task and budget.',
"""## 1. What exactly do I need to do?
Start with the task, not the tool.

## 2. What does it cost over time?
Check the official pricing page; plans change.

## 3. What happens to my data?
Read the privacy section before uploading anything sensitive.

## 4. Can I check the output?
Prefer tools that show sources or let you review changes.

## 5. Is there an alternative?
Browse the [AI tools directory](/ai-tools) and compare."""),
]
bl=[dict(slug=slug(a),title=a,category=c,excerpt=e,content=ct,kind='blog',published=False,author='Promptzyra Editorial Team',read_time='5 min read',tags=[]) for a,c,e,ct in B]
json.dump(bl,open('content/seed-blog-drafts.json','w'),indent=1,ensure_ascii=False); print(len(bl),'blog drafts')

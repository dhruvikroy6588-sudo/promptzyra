import json, re
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:90]
P=[]
def p(cat,title,level,aud,summary,prompt,when,how,tips,tags,models=None):
    P.append(dict(slug=slug(title),title=title,category=cat,level=level,audience=aud,summary=summary,prompt=prompt.strip(),when_to_use=when,
      how_to_use="\n".join(how),tips=tips,tags=tags,models=models or ["chatgpt","claude","gemini"],status="draft"))
# ---- education
p('education','Create a 45-minute lesson plan with a clear objective','Beginner','Teacher','Build a timed lesson plan with objective, activities, checks for understanding and homework.',
"""Act as an experienced {{subject}} teacher. Create a 45-minute lesson plan for {{grade level}} students on "{{topic}}".
Include: 1) one measurable learning objective, 2) a 5-minute starter, 3) the main teaching segment with timings, 4) one student activity in pairs, 5) two questions to check understanding, 6) a 5-minute exit ticket, 7) optional homework.
Keep language suitable for {{grade level}}. Flag any common misconception students have about this topic.""",
'You need a ready structure for tomorrow’s class and want it timed.',['Replace the four placeholders with your subject, grade, and topic.','Paste the prompt into your AI assistant.','Check the timings add up to 45 minutes and adapt activities to your room.'],['Add the exam board or curriculum standard for closer alignment.','Ask for a differentiated version for struggling and advanced learners.'],['lesson plan','teaching'])
p('education','Generate a multiple-choice quiz with explanations','Beginner','Teacher','Create a quiz with plausible wrong answers and a one-line explanation for each correct answer.',
"""Write {{number}} multiple-choice questions on "{{topic}}" for {{level}} learners. Each question needs four options, only one correct. Make wrong options plausible (based on common mistakes). After the quiz, give an answer key with a one-sentence explanation per question. Mix recall and application questions.""",
'You want a quick formative check or revision quiz.',['Fill in number, topic and level.','Generate and read every question for accuracy.','Remove or fix any question you disagree with before using it.'],['Ask for the quiz in a table you can paste into a form.','Always verify answers; AI can be confidently wrong.'],['quiz','assessment'])
p('education','Explain a hard concept three ways','Beginner','Teacher','Get a simple explanation, an analogy and a worked example for a tricky topic.',
"""Explain "{{concept}}" to {{audience}} in three ways: (1) a plain-language explanation in under 100 words, (2) an everyday analogy, (3) a short worked example with steps. Then list two misunderstandings learners often have and how to correct them.""",
'A topic keeps confusing students and one explanation is not enough.',['Name the concept and the audience.','Use the three explanations in different moments of the lesson.','Ask students which one made sense and why.'],['Specify what the learners already know to avoid mismatched difficulty.'],['explanation','analogy'])
p('education','Design a rubric for a written assignment','Intermediate','Teacher','Produce a four-level rubric with clear descriptors you can share with students.',
"""Create a grading rubric for a {{assignment type}} for {{grade level}}. Use four performance levels (Excellent, Good, Developing, Beginning) and these criteria: {{criteria, e.g. argument, evidence, structure, language}}. Write observable descriptors for each cell, in student-friendly language. Add total marks of {{total}}.""",
'You need transparent marking criteria before handing out a task.',['List your own criteria.','Generate the rubric as a table.','Share it with students before they start.'],['Ask for a “what to do next” sentence for each level.'],['rubric','grading'])
p('education','Write differentiated tasks for mixed-ability classes','Intermediate','Teacher','Turn one learning goal into three task levels so every learner can progress.',
"""My learning goal is: "{{goal}}" for a mixed-ability {{grade level}} class. Write three versions of one task: supported, core and extension. Keep the same topic, change the scaffolding. Add one sentence on how to assess all three fairly.""",
'Students are at different levels and you want one coherent lesson.',['State one clear goal.','Generate three versions.','Check that the supported version still requires thinking.'],['Mention specific needs (for example reading support) to get more relevant scaffolds.'],['differentiation','inclusion'])
# ---- students
p('students','Build a day-by-day exam study plan','Beginner','Student','Turn your subjects and exam date into a realistic daily study schedule.',
"""I have exams in {{number}} days for these subjects: {{subjects}}. I can study {{hours}} hours per day and I find {{hardest subject}} hardest. Create a day-by-day plan with short sessions, one rest day per week, and the last two days for revision only. Use the pattern learn → practise → recall. Present it as a table.""",
'You feel overwhelmed and need a structure.',['Fill in days, subjects, hours and your weakest subject.','Copy the table into your calendar.','Adjust after the first three days based on what actually works.'],['Be honest about hours; a smaller realistic plan beats a perfect one you skip.'],['study plan','exams'])
p('students','Turn lecture notes into flashcards','Beginner','Student','Convert pasted notes into question-and-answer flashcards for active recall.',
"""Here are my notes:
{{paste notes}}
Create {{number}} flashcards in the format "Q: … / A: …". Focus on key terms, cause-and-effect and definitions. Avoid trivial questions. Keep each answer under 25 words.""",
'You have notes but passive re-reading is not working.',['Paste your own notes.','Review the cards and delete weak ones.','Import them into your flashcard app or write them by hand.'],['Making cards by hand from the answers helps memory even more.'],['flashcards','active recall'])
p('students','Explain a topic like I am a beginner, then test me','Beginner','Student','Get a simple explanation followed by questions that check whether you really understood.',
"""Teach me "{{topic}}" as if I am a beginner. First, explain it in simple words with one example. Then ask me three questions, one at a time, and wait for my answer before giving feedback. Correct me kindly and say what to review.""",
'You want a tutor-like back-and-forth instead of a wall of text.',['Replace the topic.','Answer each question in your own words.','Note the gaps it points out and revise them.'],['Type your answers even when unsure; guessing helps learning.'],['tutor','self-test'])
p('students','Summarise a chapter into a one-page revision sheet','Beginner','Student','Compress long reading into headings, key points and a short list of formulas or dates.',
"""Summarise the following chapter into a one-page revision sheet with headings, bullet points, key terms in bold and a "remember this" box of the five most important ideas:
{{paste text}}""",
'You need a quick review before a test.',['Paste a chapter section by section if it is long.','Compare the summary with your textbook.','Add anything it missed.'],['Never rely only on the summary for facts; verify with the source.'],['summary','revision'])
p('students','Check my essay argument without rewriting it','Intermediate','Student','Get feedback on structure and evidence while keeping the writing your own.',
"""Read my essay below. Do not rewrite it. Instead, tell me: (1) my main claim in one sentence, (2) the two weakest paragraphs and why, (3) where I need stronger evidence, (4) three questions a skeptical reader would ask. Essay:
{{paste essay}}""",
'You want feedback and need to follow academic integrity rules.',['Paste your own draft.','Revise it yourself using the feedback.','Follow your school’s AI policy on disclosure.'],['Ask for feedback against the marking criteria if you have them.'],['essay','feedback'])
# ---- careers
p('careers','Rewrite a resume bullet with measurable impact','Beginner','Job seeker','Turn a duty into an achievement bullet with action verb, task and result.',
"""Rewrite this resume bullet to show impact: "{{original bullet}}". Give three versions using the pattern Action verb + what I did + result (number, percent, time saved, or scope). If a number is missing, put [add number] rather than inventing one.""",
'Your bullets list duties but not results.',['Paste one bullet at a time.','Replace placeholders with your real numbers.','Keep the version that sounds like you.'],['Never invent figures; recruiters may ask about them.'],['resume','bullets'])
p('careers','Tailor your resume to a job description','Intermediate','Job seeker','Find the keywords and skills a job post asks for and map them to your real experience.',
"""Here is a job description:
{{job description}}
Here is my resume text:
{{resume}}
List the top 10 skills or keywords the employer wants, mark which ones appear in my resume, and suggest truthful ways to reword my bullets to reflect them. Do not add experience I do not have.""",
'You are applying to a specific role and want a closer match.',['Paste both texts.','Edit your resume only with true statements.','Check the result in the ATS resume checker tool.'],['Tailor each application; one generic resume is weaker.'],['tailoring','ATS'])
p('careers','Draft a concise cover letter','Beginner','Job seeker','Get a three-paragraph letter that names the role, one achievement and why you want this company.',
"""Write a cover letter under 250 words for the role of {{job title}} at {{company}}. Paragraph 1: why I am applying. Paragraph 2: one achievement with a result: {{achievement}}. Paragraph 3: why this company: {{reason}}. Tone: professional and warm. Avoid clichés like "team player" and "hard worker".""",
'You need a strong first draft fast.',['Fill in the role, company and facts.','Read it aloud and change anything that does not sound like you.','Send only after checking names and details.'],['Ask for two tone options: formal and friendly.'],['cover letter'])
p('careers','Practice a mock interview with feedback','Intermediate','Job seeker','Run a realistic interview one question at a time and get feedback on each answer.',
"""Act as an interviewer for a {{job title}} role at a {{company type}}. Ask me one question at a time, starting with a warm-up and moving to behavioural and role-specific questions. After each answer, give feedback on clarity, evidence and structure (use the STAR method) and a stronger sample answer. Do five questions.""",
'You have an interview coming up and want to practise out loud.',['Answer each question in writing or voice.','Compare with the sample but keep your own story.','Repeat until you can answer without notes.'],['Ask it to be a tougher interviewer for a second round.'],['interview','STAR'])
p('careers','Write a short LinkedIn About section','Beginner','Job seeker','Create a first-person profile summary of 120 words that highlights strengths and goals.',
"""Write a LinkedIn "About" section of about 120 words in first person. Background: {{background}}. Strengths: {{strengths}}. What I am looking for: {{goal}}. Use plain language, no buzzwords, and end with an invitation to connect.""",
'Your profile is empty or reads like a list of job titles.',['Fill the brackets honestly.','Trim anything you would not say aloud.','Update it every few months.'],['Add one concrete achievement for credibility.'],['LinkedIn','profile'])
# ---- writing
p('writing','Outline an article before writing','Beginner','Writer','Create a clear outline with working headings, key points and the reader’s question.',
"""I am writing an article on "{{topic}}" for {{audience}}. Create an outline with: the main question the reader has, a working title, an introduction angle, 5–7 headings with 2 bullet points each, and a conclusion that tells readers what to do next. Suggest where an example or statistic would help.""",
'You stare at a blank page.',['Add your topic and audience.','Rearrange the headings to fit your voice.','Write each section yourself, using the outline as a guide.'],['Ask for three alternative angles before choosing one.'],['outline'])
p('writing','Edit for clarity without changing my voice','Beginner','Writer','Tighten sentences and remove filler while keeping your style.',
"""Edit the text below for clarity and concision. Keep my voice and meaning. Show the edited version, then list the five biggest changes you made and why. Do not add new facts.
{{paste text}}""",
'Your draft is wordy or unclear.',['Paste a few paragraphs at a time.','Accept changes that help; reject those that do not.','Read the final version aloud.'],['Ask for a “changes only” list if you do not want a full rewrite.'],['editing','clarity'])
p('writing','Create a reader-friendly email','Beginner','Anyone','Write a short email with a clear ask and polite tone.',
"""Write a short email to {{recipient}} about {{purpose}}. The one thing I need from them is {{ask}} by {{date}}. Tone: {{tone}}. Keep it under 120 words with a clear subject line.""",
'You need to send a request or follow-up.',['Fill in who, what and when.','Check names, dates and tone.','Send from your own account.'],['Offer two subject-line options.'],['email'])
p('writing','Turn bullet points into a clear paragraph','Beginner','Writer','Convert rough notes into well-linked prose.',
"""Turn these notes into a clear paragraph of about {{length}} words for {{audience}}. Keep the order, add smooth transitions, and do not add facts that are not in the notes:
{{notes}}""",
'You have ideas but not sentences.',['Paste notes.','Check that no claim was added.','Edit for your voice.'],['Ask for two versions: formal and conversational.'],['paragraph'])
p('writing','Proofread and explain each correction','Beginner','Writer','Learn from your mistakes by seeing why each change was made.',
"""Proofread this text for grammar, spelling and punctuation. Output a corrected version, then a table with columns: original, corrected, reason. Use {{English variant}} spelling.
{{text}}""",
'You want to improve, not just fix.',['Paste text.','Review the table and learn the patterns.','Apply them next time.'],['Ask for a short list of your most frequent errors.'],['proofreading','grammar'])
# ---- productivity
p('productivity','Plan a week from a messy to-do list','Beginner','Anyone','Sort tasks by importance and fit them into a realistic weekly plan.',
"""Here are my tasks and deadlines: {{task list}}. I have {{hours}} focused hours per day on {{days}}. Prioritise using urgent/important, group similar tasks, and propose a weekly schedule. Point out tasks I should delay, delegate or drop.""",
'Your list is long and you do not know where to start.',['List everything, even small tasks.','Review the plan and move things to match your energy.','Check progress mid-week.'],['Include fixed commitments so the plan is realistic.'],['planning','prioritisation'])
p('productivity','Summarise meeting notes into actions','Beginner','Professional','Extract decisions, owners and deadlines from messy notes.',
"""From these meeting notes, produce: (1) a three-sentence summary, (2) decisions made, (3) action items as a table with owner and due date, (4) open questions. Do not invent owners or dates; write "unassigned" if unclear.
{{notes}}""",
'You have notes but no clear follow-up.',['Paste notes.','Fill in unassigned owners.','Share the summary with attendees.'],['Remove confidential details before using public AI tools.'],['meetings'])
p('productivity','Break a big goal into weekly milestones','Intermediate','Anyone','Create a milestone plan with checkpoints and risks.',
"""My goal is "{{goal}}" by {{deadline}}. I can spend {{hours}} hours per week. Break it into weekly milestones with deliverables, a checkpoint at the halfway mark, the three biggest risks and how to reduce them.""",
'A goal feels too large to start.',['State a specific goal and deadline.','Add the plan to your calendar.','Review weekly.'],['Ask for the smallest first step you can finish today.'],['goals','milestones'])
p('productivity','Decide between two options with a pros-cons matrix','Beginner','Anyone','Compare options against criteria that matter to you.',
"""Help me decide between {{option A}} and {{option B}}. My priorities are: {{priorities}}. Make a weighted decision table (weights 1–5), list risks of each, and ask me three clarifying questions before suggesting which fits better. The decision is mine.""",
'You are stuck between two reasonable choices.',['List your real priorities.','Answer the clarifying questions.','Use the table as input, not as the final answer.'],['Add what you would regret not trying.'],['decisions'])
p('productivity','Create a simple daily routine template','Beginner','Anyone','Design a flexible routine around your fixed commitments.',
"""Design a daily routine for a {{role}} who wakes at {{time}}, has fixed commitments {{commitments}}, and wants to include {{habit}}. Provide a weekday and a weekend version with buffer time and one 'if I fall behind' rule.""",
'You want structure without rigidity.',['Fill in your constraints.','Try it for one week.','Adjust what is unrealistic.'],['Start with two habits, not ten.'],['routine','habits'])
# ---- coding
p('coding','Explain this code line by line','Beginner','Student','Understand unfamiliar code in plain language.',
"""Explain this {{language}} code to a beginner. Go through it step by step, describe what each part does, what the output will be for the example input {{example}}, and any potential bugs.
```
{{code}}
```""",
'You inherited or copied code you do not understand.',['Paste a small piece of code.','Run it yourself to confirm the explanation.','Ask follow-up questions on parts you still find unclear.'],['Never paste secrets or private keys into any AI tool.'],['code explanation'])
p('coding','Debug an error message systematically','Intermediate','Developer','Narrow down the cause instead of guessing.',
"""I get this error in {{language/framework}}: {{error message}}. Relevant code:
```
{{code}}
```
List the three most likely causes in order, how to test each one, and the smallest fix for the most likely cause. Ask me for missing information if needed.""",
'You are stuck on a bug.',['Include the exact error and minimal code.','Test causes in the suggested order.','Understand the fix before applying it.'],['Describe what you already tried.'],['debugging'])
p('coding','Write unit tests for a function','Intermediate','Developer','Generate test cases including edge cases.',
"""Write unit tests using {{test framework}} for this {{language}} function. Include normal cases, edge cases (empty, null, large, invalid input) and one test that should fail if a common bug exists. Explain what each test checks.
```
{{function}}
```""",
'You want better test coverage.',['Paste the function.','Run the tests.','Review that the tests actually assert the right behaviour.'],['Treat generated tests as a draft; review each assertion.'],['testing'])
p('coding','Create a 4-week learning plan for a programming language','Beginner','Student','Get a project-based path with weekly goals.',
"""Create a 4-week plan to learn {{language}} for someone who already knows {{prior knowledge}}. I can study {{hours}} hours per week. Each week: topics, a small project, and a self-check. End with a portfolio project idea.""",
'You want direction instead of random tutorials.',['Fill in your background.','Follow the plan and build the projects.','Adjust the pace after week 1.'],['Prefer building to watching videos.'],['learning','roadmap'])
p('coding','Review my code for readability','Intermediate','Developer','Get suggestions on naming, structure and simplification.',
"""Review this {{language}} code for readability and maintainability. Give a prioritised list of improvements with short before/after examples. Do not change behaviour.
```
{{code}}
```""",
'You want a second pair of eyes.',['Paste a function or class.','Apply changes one at a time and run tests.','Keep your team style guide as the final authority.'],['Ask for the top three changes only to avoid overload.'],['code review'])
# ---- business
p('business','Write a one-page business plan outline','Beginner','Entrepreneur','Get a structured outline to think through your idea.',
"""Create a one-page business plan outline for {{business idea}} in {{location}}. Sections: problem, target customer, solution, how it makes money, main costs, marketing channels, three risks, first 30-day actions. Ask me five questions where my idea is vague.""",
'You are validating an idea.',['Describe your idea honestly.','Answer the questions.','Test assumptions with real customers.'],['Numbers should come from your research, not the AI.'],['plan'])
p('business','Draft a polite customer reply to a complaint','Beginner','Professional','Respond with empathy, facts and a clear next step.',
"""A customer wrote: "{{complaint}}". Draft a reply that acknowledges the problem, apologises where appropriate, explains what we will do ({{resolution}}) and when, and invites them to reply. Tone: calm and respectful. Under 150 words.""",
'You want a consistent, professional tone.',['Paste the complaint and your resolution.','Edit for accuracy.','Send with your name.'],['Remove personal data before using public AI tools.'],['customer service'])
p('business','Create product description variations','Beginner','Marketer','Write benefit-focused descriptions for different audiences.',
"""Write three versions of a product description for {{product}}: (1) 50 words for a product page, (2) 20 words for a social post, (3) 100 words for an email. Lead with benefits for {{audience}}, mention {{features}}, and avoid exaggerated claims.""",
'You need copy for multiple channels.',['List real features.','Check every claim is true.','A/B test versions.'],['Ban words you never use in your brand voice.'],['copywriting'])
p('business','Summarise competitors from public information','Intermediate','Entrepreneur','Compare competitors using only sources you provide.',
"""Using only the text I provide below, compare these competitors on target customer, pricing approach, strengths and gaps. If information is missing, say "not stated". Provide a table and three opportunities for us.
{{pasted public information}}""",
'You researched competitors and need to organise it.',['Paste public information you collected.','Verify the table.','Decide your positioning yourself.'],['Do not ask the AI to guess prices.'],['competitor analysis'])
p('business','Plan a simple launch email sequence','Intermediate','Marketer','Outline a three-email sequence with goals and subject lines.',
"""Plan a 3-email launch sequence for {{product}} aimed at {{audience}}. For each email: goal, subject line options, key message, call to action, and send timing. Keep claims honest and include an unsubscribe reminder.""",
'You are launching something small.',['Fill details.','Write final emails yourself using the outline.','Track opens and clicks.'],['Follow email marketing laws in your region.'],['email marketing'])
# ---- social
p('social-media','Plan a four-week content calendar','Beginner','Creator','Get themes and post ideas for a month.',
"""Create a 4-week content calendar for a {{niche}} account on {{platform}} posting {{frequency}}. Give weekly themes, post ideas with format (video, carousel, text), a hook for each, and one engagement question per week.""",
'You post inconsistently.',['Fill niche, platform and frequency.','Choose ideas you can really make.','Review results after four weeks.'],['Batch-create content to save time.'],['calendar'])
p('social-media','Write hooks for a short video','Beginner','Creator','Generate several opening lines that stop the scroll honestly.',
"""Write 10 opening hooks (under 12 words) for a short video about "{{topic}}" for {{audience}}. Mix styles: question, surprising fact, mistake, promise. Avoid clickbait that the video cannot deliver.""",
'You struggle with the first line.',['Pick two hooks.','Record both versions.','Keep the one that retains viewers.'],['The video must deliver on the hook.'],['video','hooks'])
p('social-media','Repurpose a blog post into social posts','Intermediate','Creator','Create posts for several platforms from one article.',
"""Repurpose this article into: a LinkedIn post (150 words), five short posts, and a 30-second video script. Keep the main message and add a link placeholder.
{{article text}}""",
'You want more reach from content you already made.',['Paste your own article.','Edit each output for the platform.','Schedule posts.'],['Credit and link the original.'],['repurposing'])
p('social-media','Write a caption with three tone options','Beginner','Creator','See formal, friendly and playful versions side by side.',
"""Write three captions for a post about {{subject}}: professional, friendly and playful. Each under 40 words with 3 relevant hashtags and one call to action.""",
'You want options quickly.',['Add the subject.','Pick or mix.','Avoid misleading claims.'],['Add your brand words as a style hint.'],['captions'])
p('social-media','Create a posting checklist before publishing','Beginner','Creator','Catch errors before you hit publish.',
"""Create a pre-publish checklist for a {{platform}} post about {{topic}}: accuracy, permission for images and music, accessibility (alt text, captions), links, hashtags and tone. Keep it to 10 items.""",
'You want fewer mistakes.',['Use the checklist every time.','Adapt it to your account.','Keep it somewhere visible.'],['Add legal items for your region.'],['checklist'])
# ---- ai images
p('ai-images','Photo-style prompt formula for a product shot','Beginner','Creator','Structure a prompt with subject, light, lens and background.',
"""A professional product photo of {{product}} on {{surface}}, {{lighting}} lighting, shallow depth of field, 50mm lens, clean {{background colour}} background, high detail, soft shadows, no text.""",
'You need a clean image concept for a mock-up.',['Fill the blanks.','Generate a few variations.','Check hands, text and logos in the result.'],['Change one variable at a time.'],['product photo'],['chatgpt','gemini','midjourney'])
p('ai-images','Illustration style prompt for a classroom poster','Beginner','Teacher','Create a friendly illustration idea for a learning poster.',
"""A bright, friendly flat illustration for a classroom poster about {{topic}}, simple shapes, {{colour palette}}, space at the top for a title, suitable for {{age group}}.""",
'You want a visual for teaching material.',['Fill topic and age.','Add the text yourself in a design tool.','Check that the image is accurate.'],['AI often garbles text; add text separately.'],['poster','illustration'],['chatgpt','gemini','midjourney'])
p('ai-images','Portrait lighting prompt guide','Intermediate','Creator','Describe light direction and mood clearly.',
"""A portrait of {{subject}} with {{light direction}} soft window light, {{mood}} mood, neutral background, natural skin texture, 85mm lens, shallow depth of field.""",
'You want consistent, natural-looking results.',['Choose light and mood.','Generate and compare.','Use only images you have the right to use.'],['Avoid imitating a living artist’s style.'],['portrait'],['chatgpt','gemini','midjourney'])
p('ai-images','Infographic layout prompt','Intermediate','Creator','Plan an infographic’s structure for a designer or AI tool.',
"""Describe a clean infographic layout about {{topic}}: title area, three sections with icon placeholders, a data callout and a footer. Use {{palette}} and plenty of white space. Provide the exact short text for each section.""",
'You need a structured layout idea.',['Provide the text.','Build the final in a design tool.','Check facts before publishing.'],['Keep text short for readability.'],['infographic'],['chatgpt','claude','gemini'])
p('ai-images','Photo edit instruction for a background change','Beginner','Anyone','Ask an image editor for a precise change while keeping the subject.',
"""Keep the person and their pose exactly the same. Replace the background with {{new background}}, match the lighting and shadows, keep natural edges around hair, no extra objects.""",
'You edit photos you own.',['Upload your own photo.','Run the edit.','Zoom in to check edges.'],['Only edit photos you have permission to use.'],['photo edit'],['chatgpt','gemini'])
# ---- daily life
p('daily-life','Plan a budget trip itinerary','Beginner','Anyone','Create a day-by-day plan around your budget and interests.',
"""Plan a {{days}}-day trip to {{destination}} with a budget of {{budget}} per person. Interests: {{interests}}. Give a day-by-day outline, rough cost categories, transport tips and what to book early. Remind me to verify opening hours and prices.""",
'You want a first draft of a trip plan.',['Fill details.','Verify every price and time on official sites.','Save the plan offline.'],['Prices change; treat estimates as rough.'],['travel'])
p('daily-life','Create a simple monthly budget','Beginner','Anyone','Organise income and spending categories.',
"""Help me create a simple monthly budget. Income: {{income}}. Fixed costs: {{fixed costs}}. Goals: {{goal}}. Suggest a category split, where I could save, and a weekly check-in routine. This is general information, not financial advice.""",
'You want clarity on spending.',['Use your real numbers.','Track for a month.','Adjust categories.'],['Do not share account numbers.'],['budget'])
p('daily-life','Learn a new skill in 30 days','Beginner','Anyone','Get a small daily practice plan.',
"""I want to learn {{skill}} in 30 days with {{minutes}} minutes a day. Create a plan with weekly themes, daily tasks, a mini-project each week, and how to measure progress.""",
'You want a manageable habit.',['Fill in the skill and time.','Do day 1 today.','Review on day 10.'],['Short daily practice beats long rare sessions.'],['learning','habit'])
p('daily-life','Meal plan with a shopping list','Beginner','Anyone','Plan simple meals for a week with ingredients.',
"""Create a 5-day dinner plan for {{people}} people with a budget of {{budget}}, avoiding {{foods to avoid}}. Use overlapping ingredients to reduce waste and give a consolidated shopping list. Note: I will check nutrition and allergy information myself.""",
'You want less food waste.',['List allergies and preferences.','Check recipes.','Shop with the list.'],['For medical diets consult a professional.'],['meal plan'])
p('daily-life','Prepare questions for a doctor or service appointment','Beginner','Anyone','Organise your thoughts before an appointment.',
"""Help me prepare for an appointment about {{topic}}. Create a list of questions to ask, information to bring, and a short summary of my situation: {{situation}}. Do not give a diagnosis or treatment advice.""",
'You forget what to ask when you are there.',['Add your situation.','Print or save the list.','Take notes during the appointment.'],['This is preparation only, not medical advice.'],['appointments'])
json.dump(P,open('content/seed-prompts.json','w'),indent=1,ensure_ascii=False)
print(len(P),'prompts')

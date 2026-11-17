# Skill-writing brief (Promptzyra "Skills": downloadable, education-focused AI skills)
A "skill" = a folder with SKILL.md that teaches an AI assistant (Claude Code / Claude.ai Skills, or any chat model when pasted as instructions) how to do ONE job well. Write ORIGINAL, genuinely working skills for learners, teachers, job seekers and professionals. Do not copy any existing skill, repository or website.
Output: ONE JSON array (10 objects) at the path you are given, written with Python json.dump. Each object:
{ "slug": kebab-case (also the skill name, max 40 chars),
  "name": "Human Title",
  "description": "<= 280 chars. Says what the skill does AND when to use it (trigger phrases), e.g. 'Builds a day-by-day exam study plan from a syllabus and exam date. Use when a student asks for a revision schedule, study timetable or exam prep plan.'",
  "category": one of: study-learning | teaching-lesson-design | assessment-feedback | writing-research | language-learning | math-science | career-resume | productivity-planning | coding-tutor,
  "tags": [4-6 lowercase], "audience": "Student|Teacher|Job seeker|Professional|Anyone", "level": "Beginner|Intermediate|Advanced",
  "skill_md": the COMPLETE SKILL.md text: starts with YAML frontmatter exactly `---\nname: <slug>\ndescription: <same description, single line>\n---\n` then a body of 350-600 words using these sections: `# Title`, `## When to use`, `## What to ask the user first` (the inputs; ask only for what is missing), `## Workflow` (numbered steps the assistant follows), `## Output format` (a concrete template/skeleton), `## Quality checks` (what to verify before answering), `## Boundaries` (academic integrity: help the user learn and write their own work, no fake citations/statistics, say when unsure, protect personal data). Must be precise and executable by an AI, not vague advice.
  "references_md": optional second file (reference/checklist/rubric/example) 150-350 words, or "" ,
  "use_cases": [3 short strings], "example_prompts": [3 realistic user messages that would trigger the skill],
  "seo_title": <=60 chars, "seo_description": 145-160 chars }
Rules: no fabricated statistics, studies, awards or download counts; no claims about security scans or endorsements; no brand-specific claims; slugs unique within your file and distinct from the others' topics (other writers cover other themes). Validate with a Python check (keys present, frontmatter parses, name==slug, description<=280, skill_md 300+ words, slugs unique) and print results. Touch no other file. Final reply: one line with path + count.

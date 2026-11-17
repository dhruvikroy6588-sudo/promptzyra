# Brief: content for Promptzyra component sections (education-focused)
Output: a JSON array in the file you are told. Each item:
{ "type": "agents|commands|settings|hooks|mcps|mods|plugins",
  "slug": "kebab-case-unique", "name": "Title", "description": "1-2 sentences (<=200 chars)",
  "category": "<one of: study-learning, teaching, assessment, writing-research, language, coding-education, productivity, admin-ops>",
  "tags": ["3-5 lowercase"], "author": "who made the upstream thing, or 'Promptzyra' if original",
  "github_url": "REAL, verified-by-fetch URL of the upstream repo/docs page that this item is based on or documents (required for mcps/plugins; for original items link the official docs page e.g. https://docs.claude.com/... that defines the format, verified)",
  "install": "plain-English install/use steps (3-6 lines). NEVER invent CLI commands; only use commands you verified in the official docs/README you fetched.",
  "files": [ {"path":"relative/file/name.md|.json","content":"full file text"} ],
  "use_cases": ["3-4 short"], "example_prompts": ["2-3 short"],
  "level": "Beginner|Intermediate|Advanced", "audience": "Students|Teachers|Developers|Anyone" }
Rules: accuracy first. Verify every github_url with WebFetch (must load, must be what you say). Do not invent star counts or stats. Write original content (no copying text from repos). Config files must follow the real schema documented at docs.claude.com / code.claude.com (agents/commands = markdown with YAML frontmatter; settings = settings.json; hooks = {"hooks":{"PostToolUse":[{"matcher":"...","hooks":[{"type":"command","command":"..."}]}]}}; MCP = {"mcpServers":{...}} only for servers you verified exist). 10-12 items per type you own. Education/students/teachers focus where natural. Validate JSON with python before finishing. Only write your own output file.

## Extra rules for the big batch
- Read /home/claude/work/pz/content/components-parts/existing.json (list of existing slugs) and do not reuse those slugs; make every slug unique inside your file.
- Every item must be genuinely different (different task, different instructions); no near-duplicates with renamed titles. Keep file contents focused (agents/commands ~15-40 lines; configs short).
- Use only categories listed. Write the file in 2-3 chunks (python merge) and validate JSON before finishing. Final reply: 2 lines.

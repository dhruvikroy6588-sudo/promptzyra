// Shared (server + client safe) definitions for the 7 component sections.
export const COMPONENT_TYPES = {
  agents:   { label: 'Agents',   single: 'Agent',   path: '/agents',   icon: 'bot',      blurb: 'Reusable sub-agent definitions (Markdown with YAML frontmatter) that give an AI assistant a focused role, such as a study coach or a rubric reviewer.', folder: '.claude/agents' },
  commands: { label: 'Commands', single: 'Command', path: '/commands', icon: 'terminal', blurb: 'Slash-command prompt files you can drop into a project so a common task becomes one short command.', folder: '.claude/commands' },
  settings: { label: 'Settings', single: 'Setting', path: '/settings', icon: 'settings', blurb: 'Ready-to-read settings.json examples for permissions, models and environment options, explained in plain English.', folder: '.claude' },
  hooks:    { label: 'Hooks',    single: 'Hook',    path: '/hooks',    icon: 'link',     blurb: 'Hook configurations that run your own commands at set moments, for example after a file is edited.', folder: '.claude' },
  mcps:     { label: 'MCPs',     single: 'MCP',     path: '/mcps',     icon: 'plug',     blurb: 'Model Context Protocol servers that let an AI assistant reach files, the web, notes and other tools, with links to the source repositories.', folder: '' },
  mods:     { label: 'Mods',     single: 'Mod',     path: '/mods',     icon: 'braces',   blurb: 'Small customisations that change how your AI tool looks or behaves, such as status lines and output styles.', folder: '' },
  plugins:  { label: 'Plugins',  single: 'Plugin',  path: '/plugins',  icon: 'wrench',   blurb: 'Plugins and plugin collections that bundle agents, commands, hooks and skills, with links to their public GitHub repositories.', folder: '' },
};
export const COMPONENT_TYPE_KEYS = Object.keys(COMPONENT_TYPES);
export const COMPONENT_CATS = [
  ['study-learning', 'Study & Learning'], ['teaching', 'Teaching'], ['assessment', 'Assessment'], ['writing-research', 'Writing & Research'],
  ['language', 'Language Learning'], ['coding-education', 'Coding Education'], ['productivity', 'Productivity'], ['admin-ops', 'Admin & Setup'],
];
export const COMPONENT_CAT_MAP = Object.fromEntries(COMPONENT_CATS);
export const componentFiles = (c) => (Array.isArray(c?.files) ? c.files : []).filter((f) => f && f.path).map((f) => ({ path: String(f.path), text: String(f.content ?? f.text ?? '') }));

// Central site constants. Change SITE_URL only if the domain changes.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://promptzyra.com').replace(/\/$/, '');
export const SITE_NAME = 'Promptzyra';
export const SITE_TAGLINE = 'Learn AI with tested prompts, a tools directory and a free resume builder';
export const SITE_DESCRIPTION = 'Promptzyra is a free education-focused AI library: original prompts for students, teachers and job seekers, an AI tools directory with plain-language guides, and a free resume builder with 100 templates.';
export const CONTACT_EMAIL = 'contantnewshour@gmail.com';
export const GA_ID = 'G-MBDBKQHL54';
export const PAGE_SIZE = 24;
export const MODELS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'copilot', label: 'Copilot' },
  { id: 'grok', label: 'Grok' },
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'midjourney', label: 'Midjourney' },
];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const PRICING = ['Free', 'Freemium', 'Free trial', 'Paid', 'Open source'];
export const abs = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const slugify = (s = '') => String(s).toLowerCase().trim().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
export const modelLabel = (id) => MODELS.find((m) => m.id === id)?.label || id;
const ICONS = { 'building-2': '🏢', 'book-open': '📖', briefcase: '💼', code: '💻', 'graduation-cap': '🎓', image: '🖼️', 'list-checks': '✅', megaphone: '📣', 'message-square': '💬', mic: '🎙️', palette: '🎨', 'pen-line': '✍️', search: '🔎', school: '🏫', sparkles: '✨', sun: '☀️', 'trending-up': '📈', video: '🎬', wrench: '🛠️' };
export const icon = (n) => (!n ? '✨' : ICONS[n] || (n.length <= 4 ? n : '✨'));

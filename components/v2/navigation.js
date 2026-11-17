import { GraduationCap, Bot, Terminal, Settings, Link2, Plug, Braces, Bookmark, Zap, Sparkles, Camera, Wrench, FileText, Hammer, Flame, Gift, BookOpen, Info, Mail, CircleHelp } from 'lucide-react';

// Central navigation config (sidebar + mobile drawer).
// `expand` = category kind listed inline (data from the layout); `count` = kind whose total shows as a pill;
// `staticSub` = fixed sub-links (Photo Prompts subjects).
export const PHOTO_SUBJECTS = [['Men', 'men'], ['Women', 'women'], ['Couple', 'couple'], ['Family', 'family'], ['Kids', 'kids'], ['Pets', 'pets'], ['Birthday', 'birthday'], ['Portrait', 'portrait']];
export const NAV_GROUPS = [
  { label: 'Workplace', items: [
    { label: 'Saved', href: '/saved', icon: Bookmark },
  ] },
  { label: 'Browse', items: [
    { label: 'Skills', href: '/skills', icon: Zap, expand: 'skill', count: 'skill' },
    { label: 'AI Courses', href: '/courses', icon: GraduationCap, count: 'courses' },
    { label: 'Agents', href: '/agents', icon: Bot, count: 'agents' },
    { label: 'Commands', href: '/commands', icon: Terminal, count: 'commands' },
    { label: 'Settings', href: '/settings', icon: Settings, count: 'settings' },
    { label: 'Hooks', href: '/hooks', icon: Link2, count: 'hooks' },
    { label: 'MCPs', href: '/mcps', icon: Plug, count: 'mcps' },
    { label: 'Mods', href: '/mods', icon: Braces, count: 'mods' },
    { label: 'Plugins', href: '/plugins', icon: Wrench, count: 'plugins' },
    { label: 'AI Prompts', href: '/prompts', icon: Sparkles, expand: 'prompt', count: 'prompt' },
    { label: 'Photo Prompts', href: '/photo-prompts', icon: Camera, count: 'photo', expand: 'photo' },
    { label: 'AI Tools', href: '/ai-tools', icon: Wrench, expand: 'tool', count: 'tool' },
    { label: 'Resume Builder', href: '/resume-builder', icon: FileText },
    { label: 'Free Tools', href: '/tools', icon: Hammer },
  ] },
  { label: 'Discover', items: [
    { label: 'Trending', href: '/trending', icon: Flame },
    { label: 'Free Guides', href: '/free-guides', icon: Gift },
  ] },
  { label: 'Resources', items: [
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Mail },
    { label: 'FAQ', href: '/faq', icon: CircleHelp },
  ] },
];

export const HEADER_NAV = [['Prompts', '/prompts'], ['Photo Prompts', '/photo-prompts'], ['AI Tools', '/ai-tools'], ['Resume Builder', '/resume-builder'], ['Free Tools', '/tools'], ['Blog', '/blog']];

export const FOOTER_GROUPS = [
  { label: 'Explore', links: [['AI Prompts', '/prompts'], ['Photo Prompts', '/photo-prompts'], ['AI Tools', '/ai-tools'], ['Trending Prompts', '/trending'], ['Saved Prompts', '/saved']] },
  { label: 'Create', links: [['Prompt Builder', '/prompt-builder'], ['Resume Builder', '/resume-builder'], ['Resume Templates', '/resume-templates'], ['Cover Letter Builder', '/cover-letter-builder'], ['Study Planner', '/study-planner']] },
  { label: 'Learn', links: [['Blog & Guides', '/blog'], ['Free Guides', '/free-guides'], ['Free Tools', '/tools'], ['FAQ', '/faq'], ['HTML Sitemap', '/site-map']] },
  { label: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Editorial Policy', '/editorial-policy'], ['Privacy Policy', '/privacy-policy'], ['Terms', '/terms'], ['Disclaimer', '/disclaimer'], ['Advertising Disclosure', '/advertising-disclosure'], ['Cookie Policy', '/cookie-policy']] },
];

export const CATEGORY_BASE = { prompt: '/prompts/category', photo: '/photo-prompts/category', tool: '/ai-tools/category', skill: '/skills/category' };

export const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

// Routes rendered full screen (no sidebar, no footer): resume editor + preview.
export const isFullWidth = (p) => p.startsWith('/resume-builder/editor') || p.startsWith('/resume-preview');

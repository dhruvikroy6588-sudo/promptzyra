import { Home, Sparkles, Camera, Wrench, Flame, Wand2, FileText, GraduationCap, Mail, BookOpen, Gift, Heart, Info } from 'lucide-react';

// Central navigation config. `expand` marks items whose categories show inline (sidebar + mobile drawer).
export const NAV_GROUPS = [
  { label: 'Discover', items: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'AI Prompts', href: '/prompts', icon: Sparkles, expand: 'prompt' },
    { label: 'Photo Prompts', href: '/photo-prompts', icon: Camera, expand: 'photo' },
    { label: 'AI Tools', href: '/ai-tools', icon: Wrench, expand: 'tool' },
    { label: 'Trending Prompts', href: '/trending', icon: Flame },
  ] },
  { label: 'Create', items: [
    { label: 'Prompt Builder', href: '/prompt-builder', icon: Wand2 },
    { label: 'Resume Builder', href: '/resume-builder', icon: FileText },
    { label: 'Study Planner', href: '/study-planner', icon: GraduationCap },
    { label: 'Cover Letter Builder', href: '/cover-letter-builder', icon: Mail },
  ] },
  { label: 'Learn', items: [
    { label: 'Blog & Guides', href: '/blog', icon: BookOpen },
    { label: 'Free Guides', href: '/free-guides', icon: Gift },
    { label: 'Saved Prompts', href: '/saved', icon: Heart },
    { label: 'About Promptzyra', href: '/about', icon: Info },
  ] },
];

export const HEADER_NAV = [['Prompts', '/prompts'], ['Photo Prompts', '/photo-prompts'], ['AI Tools', '/ai-tools'], ['Resume Builder', '/resume-builder'], ['Free Tools', '/tools'], ['Blog', '/blog']];

export const FOOTER_GROUPS = [
  { label: 'Explore', links: [['AI Prompts', '/prompts'], ['Photo Prompts', '/photo-prompts'], ['AI Tools', '/ai-tools'], ['Trending Prompts', '/trending'], ['Saved Prompts', '/saved']] },
  { label: 'Create', links: [['Prompt Builder', '/prompt-builder'], ['Resume Builder', '/resume-builder'], ['Resume Templates', '/resume-templates'], ['Cover Letter Builder', '/cover-letter-builder'], ['Study Planner', '/study-planner']] },
  { label: 'Learn', links: [['Blog & Guides', '/blog'], ['Free Guides', '/free-guides'], ['Free Tools', '/tools'], ['FAQ', '/faq'], ['HTML Sitemap', '/site-map']] },
  { label: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Editorial Policy', '/editorial-policy'], ['Privacy Policy', '/privacy-policy'], ['Terms', '/terms'], ['Disclaimer', '/disclaimer'], ['Advertising Disclosure', '/advertising-disclosure'], ['Cookie Policy', '/cookie-policy']] },
];

export const CATEGORY_BASE = { prompt: '/prompts/category', photo: '/photo-prompts/category', tool: '/ai-tools/category' };

export const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));

// Routes rendered without the sidebar (full-width pages).
export const isFullWidth = (p) => p === '/' || p === '/resume-builder' || p.startsWith('/resume-builder/editor') || p.startsWith('/resume-preview') || p.startsWith('/resume-templates');

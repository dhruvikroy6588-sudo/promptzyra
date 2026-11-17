import { SITE_URL } from '@/lib/site';
export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/search', '/resume-builder/editor', '/resume-preview/'] }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}

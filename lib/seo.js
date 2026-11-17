import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, abs } from './site';

export function buildMetadata({ title, description, path = '/', image, noindex = false, type = 'website', publishedTime, modifiedTime } = {}) {
  const url = abs(path);
  const img = image || abs('/og-default.png');
  const full = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : SITE_NAME;
  return {
    title: { absolute: full.length > 70 && title ? title : full },
    description: (description || SITE_DESCRIPTION).slice(0, 170),
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: { title: title || SITE_NAME, description: (description || SITE_DESCRIPTION).slice(0, 200), url, siteName: SITE_NAME, type, images: [{ url: img, width: 1200, height: 630 }], ...(publishedTime ? { publishedTime } : {}), ...(modifiedTime ? { modifiedTime } : {}) },
    twitter: { card: 'summary_large_image', title: title || SITE_NAME, description: (description || SITE_DESCRIPTION).slice(0, 200), images: [img] },
  };
}

export const orgJsonLd = () => ({ '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: abs('/icon.svg') });
export const websiteJsonLd = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } });
export const breadcrumbJsonLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })) });
export const faqJsonLd = (faq = []) => faq.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null;
export const articleJsonLd = (p) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, image: p.image ? [p.image] : undefined, datePublished: p.published, dateModified: p.modified || p.published, author: { '@type': 'Person', name: p.author || SITE_NAME + ' Editorial Team' }, publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: abs('/icon.svg') } }, mainEntityOfPage: abs(p.path) });
export const itemListJsonLd = (items) => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name })) });
export const softwareJsonLd = (t) => ({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: t.name, description: t.tagline, applicationCategory: 'BrowserApplication', url: abs(`/ai-tools/${t.slug}`) });

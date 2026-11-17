import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { getCategories, listBlog } from '@/lib/data';
import InfoPage from '@/components/v2/InfoPage';
export const metadata = buildMetadata({ title: 'Site Map: All Promptzyra Pages and Categories', description: 'A complete HTML site map of Promptzyra: prompt, photo prompt, AI tool and blog categories, resume tools, latest articles and all information pages.', path: '/site-map' });
export const revalidate = 3600;
const CatList = ({ items, base }) => (<ul>{items.map((c) => <li key={c.slug}><Link href={`${base}/${c.slug}`}>{c.name}</Link></li>)}</ul>);
export default async function Page() {
  const [prompts, tools, blog, photos, posts] = await Promise.all([
    getCategories('prompt'), getCategories('tool'), getCategories('blog'), getCategories('photo'), listBlog({ pageSize: 20 }),
  ]);
  const rows = posts?.rows || [];
  return (<InfoPage title="Site Map" path="/site-map" updated={null} lead="Every main section of Promptzyra in one place.">
    <h2>Main sections</h2>
    <ul>
      <li><Link href="/">Home</Link></li><li><Link href="/prompts">AI prompts</Link></li><li><Link href="/photo-prompts">Photo prompts</Link></li><li><Link href="/ai-tools">AI tools directory</Link></li><li><Link href="/blog">Blog</Link></li><li><Link href="/free-guides">Free guides</Link></li><li><Link href="/search">Search</Link></li>
    </ul>
    <h2>Resume and free tools</h2>
    <ul>
      <li><Link href="/resume-builder">Resume builder</Link></li><li><Link href="/resume-templates">Resume templates</Link></li><li><Link href="/ats-resume-checker">ATS resume checker</Link></li><li><Link href="/cover-letter-builder">Cover letter builder</Link></li><li><Link href="/study-planner">Study planner</Link></li><li><Link href="/prompt-builder">Prompt builder</Link></li><li><Link href="/tools">Free tools</Link></li>
    </ul>
    {prompts.length > 0 && <><h2>Prompt categories</h2><CatList items={prompts} base="/prompts/category" /></>}
    {photos.length > 0 && <><h2>Photo prompt categories</h2><CatList items={photos} base="/photo-prompts/category" /></>}
    {tools.length > 0 && <><h2>AI tool categories</h2><CatList items={tools} base="/ai-tools/category" /></>}
    {blog.length > 0 && <><h2>Blog categories</h2><CatList items={blog} base="/blog/category" /></>}
    {rows.length > 0 && <><h2>Latest articles</h2><ul>{rows.map((p) => <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)}</ul></>}
    <h2>About and policies</h2>
    <ul>
      <li><Link href="/about">About</Link></li><li><Link href="/contact">Contact</Link></li><li><Link href="/how-it-works">How it works</Link></li><li><Link href="/faq">FAQ</Link></li><li><Link href="/editorial-policy">Editorial policy</Link></li><li><Link href="/ai-policy">AI policy</Link></li><li><Link href="/advertising-disclosure">Advertising disclosure</Link></li><li><Link href="/privacy-policy">Privacy policy</Link></li><li><Link href="/cookie-policy">Cookie policy</Link></li><li><Link href="/terms">Terms of use</Link></li><li><Link href="/disclaimer">Disclaimer</Link></li>
    </ul>
  </InfoPage>);
}

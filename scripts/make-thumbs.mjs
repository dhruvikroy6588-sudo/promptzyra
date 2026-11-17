// Renders every resume template with sample data and saves a small WebP thumbnail into public/resume-thumbs.
// Usage: npm run build && npx next start -p 3111 &   then   node scripts/make-thumbs.mjs http://localhost:3111
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import sharp from 'sharp';
import fs from 'fs';
import { TEMPLATES } from '../lib/resume/templates.js';
const base = process.argv[2] || 'http://localhost:3111';
fs.mkdirSync('public/resume-thumbs', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 0.6 });
await page.addInitScript(() => { try { localStorage.setItem('pz-consent', 'no'); } catch (e) {} });
for (const t of TEMPLATES) {
  await page.goto(`${base}/resume-preview/${t.id}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.hdr,.cookie,.cursor-glow,.ftr{display:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$('#shot .rs-page');
  const png = await el.screenshot({ clip: undefined });
  await sharp(png).resize({ width: 420, height: 594, fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(`public/resume-thumbs/${t.id}.webp`);
  process.stdout.write(t.id + ' ');
}
await browser.close();
console.log('\ndone');

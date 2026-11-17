// 100 resume templates generated from curated design parts (layout × header × heading × bullets × dates × skills × fonts × palette).
// Every template has a unique combination; see scripts/check-templates.mjs.
export const FONT_PAIRS = {
  inter: { name: 'Inter', head: "'Inter Variable'", body: "'Inter Variable'" },
  work: { name: 'Work Sans', head: "'Work Sans Variable'", body: "'Work Sans Variable'" },
  dm: { name: 'DM Sans', head: "'DM Sans Variable'", body: "'DM Sans Variable'" },
  manrope: { name: 'Manrope', head: "'Manrope Variable'", body: "'Manrope Variable'" },
  jakarta: { name: 'Plus Jakarta', head: "'Plus Jakarta Sans Variable'", body: "'Plus Jakarta Sans Variable'" },
  bric: { name: 'Bricolage + Inter', head: "'Bricolage Grotesque Variable'", body: "'Inter Variable'" },
  space: { name: 'Space Grotesk + Inter', head: "'Space Grotesk Variable'", body: "'Inter Variable'" },
  playfair: { name: 'Playfair + Inter', head: "'Playfair Display Variable'", body: "'Inter Variable'" },
  lora: { name: 'Lora + Inter', head: "'Lora Variable'", body: "'Inter Variable'" },
  merri: { name: 'Merriweather', head: "'Merriweather'", body: "'Merriweather'" },
  source: { name: 'Source Serif', head: "'Source Serif 4 Variable'", body: "'Source Serif 4 Variable'" },
  mono: { name: 'JetBrains + Inter', head: "'JetBrains Mono Variable'", body: "'Inter Variable'" },
};
export const PALETTES = [
  ['Slate', '#475569', '#1e293b'], ['Navy', '#1d4ed8', '#0f1f4d'], ['Teal', '#0d9488', '#0b3d3a'], ['Forest', '#15803d', '#12351f'],
  ['Burgundy', '#be123c', '#4a0d1f'], ['Plum', '#7e22ce', '#2e1065'], ['Orange', '#ea580c', '#431407'], ['Gold', '#b45309', '#3b2506'],
  ['Sky', '#0284c7', '#082f49'], ['Rose', '#e11d48', '#4c0519'], ['Indigo', '#4f46e5', '#1e1b4b'], ['Emerald', '#059669', '#022c22'],
  ['Charcoal', '#111827', '#111827'], ['Graphite', '#374151', '#1f2937'], ['Coral', '#f0506e', '#3f0d1a'], ['Olive', '#4d7c0f', '#1a2e05'],
  ['Cyan', '#0891b2', '#083344'], ['Magenta', '#c026d3', '#3b0a45'], ['Brown', '#92400e', '#2b1708'], ['Steel', '#3b6ea5', '#16283d'],
].map(([name, accent, dark]) => ({ name, accent, dark }));

export const CATEGORIES = [
  { slug: 'ats-friendly', name: 'ATS-friendly', blurb: 'Single-column, text-first designs that applicant tracking systems read cleanly.' },
  { slug: 'professional', name: 'Professional', blurb: 'Balanced, conventional layouts for corporate, finance, admin and operations roles.' },
  { slug: 'modern', name: 'Modern', blurb: 'Fresh sidebars and colour accents for marketing, product and design-adjacent roles.' },
  { slug: 'creative', name: 'Creative', blurb: 'Bolder type and colour for designers, writers, media and portfolio careers.' },
  { slug: 'simple', name: 'Simple', blurb: 'Quiet, minimal layouts when you want the content to do the talking.' },
  { slug: 'student', name: 'Student & fresher', blurb: 'Education-first layouts that make projects, skills and internships shine.' },
  { slug: 'executive', name: 'Executive', blurb: 'Refined serif and classic layouts for senior and leadership profiles.' },
  { slug: 'tech', name: 'Tech', blurb: 'Skill-forward layouts for engineers, data and IT professionals.' },
];
// [layout, header, tone]
const S = (l, h, t = 'dark') => ({ layout: l, header: h, tone: t });
const SPEC = {
  'ats-friendly': { n: 12, structs: [S('single', 'left'), S('single', 'center'), S('single', 'split')], fonts: ['inter', 'work', 'dm', 'source', 'manrope', 'lora'], pal: [12, 13, 0, 1, 19, 2, 3, 10], heads: ['plain', 'underline', 'caps', 'sidebar-rule'], bullets: ['disc', 'dash'], skills: ['inline', 'list'], dates: ['right', 'below'], size: 13 },
  professional: { n: 13, structs: [S('single', 'center'), S('single', 'split'), S('single', 'band'), S('two', 'left'), S('two', 'split')], fonts: ['inter', 'lora', 'dm', 'source', 'jakarta', 'merri'], pal: [1, 2, 4, 13, 19, 16, 3, 0], heads: ['underline', 'caps', 'sidebar-rule', 'double'], bullets: ['disc', 'square', 'dash'], skills: ['inline', 'chips', 'list'], dates: ['right', 'below'], size: 13 },
  modern: { n: 13, structs: [S('side-l', 'left', 'tint'), S('side-r', 'left', 'tint'), S('side-l', 'left', 'dark'), S('single', 'band'), S('single', 'block')], fonts: ['jakarta', 'manrope', 'bric', 'dm', 'space', 'work'], pal: [10, 8, 11, 14, 17, 2, 6, 1], heads: ['bar', 'caps', 'dot', 'underline'], bullets: ['disc', 'arrow', 'square'], skills: ['chips', 'list', 'grid'], dates: ['right', 'below'], size: 13 },
  creative: { n: 12, structs: [S('side-l', 'stack', 'dark'), S('single', 'block'), S('timeline', 'left'), S('side-r', 'stack', 'dark'), S('single', 'band')], fonts: ['bric', 'playfair', 'space', 'jakarta', 'manrope'], pal: [17, 14, 6, 5, 9, 8, 10, 18], heads: ['box', 'bar', 'dot', 'caps'], bullets: ['arrow', 'square', 'disc'], skills: ['chips', 'grid'], dates: ['left', 'right', 'below'], size: 13 },
  simple: { n: 12, structs: [S('single', 'left'), S('single', 'center'), S('timeline', 'left'), S('single', 'split')], fonts: ['dm', 'inter', 'work', 'lora', 'source', 'manrope'], pal: [12, 13, 0, 19, 3, 1], heads: ['plain', 'sidebar-rule', 'underline', 'dot'], bullets: ['disc', 'dash'], skills: ['inline', 'list', 'chips'], dates: ['right', 'left', 'below'], size: 13 },
  student: { n: 12, structs: [S('grid2', 'left'), S('two', 'block'), S('single', 'band'), S('side-l', 'left', 'tint'), S('grid2', 'center')], fonts: ['jakarta', 'dm', 'manrope', 'work', 'inter', 'bric'], pal: [8, 11, 10, 2, 14, 16, 3, 6], heads: ['bar', 'caps', 'dot', 'underline'], bullets: ['disc', 'arrow', 'square'], skills: ['chips', 'grid', 'inline'], dates: ['right', 'below'], size: 13, eduFirst: true },
  executive: { n: 13, structs: [S('single', 'center'), S('single', 'split'), S('side-l', 'left', 'dark'), S('single', 'band'), S('two', 'center')], fonts: ['playfair', 'merri', 'lora', 'source', 'inter'], pal: [12, 1, 4, 19, 18, 13, 7, 3], heads: ['double', 'caps', 'underline', 'sidebar-rule'], bullets: ['square', 'disc', 'dash'], skills: ['inline', 'list'], dates: ['right', 'below'], size: 13 },
  tech: { n: 13, structs: [S('two', 'left'), S('timeline', 'split'), S('side-l', 'left', 'dark'), S('grid2', 'left'), S('side-r', 'left', 'tint')], fonts: ['mono', 'space', 'inter', 'dm', 'work', 'bric'], pal: [16, 10, 11, 1, 13, 5, 8, 15], heads: ['sidebar-rule', 'bar', 'caps', 'dot'], bullets: ['arrow', 'dash', 'square', 'disc'], skills: ['chips', 'grid', 'list'], dates: ['right', 'left', 'below'], size: 13 },
};
const NAMES = {
  'ats-friendly': ['Plain Text', 'Clear Path', 'Recruiter', 'Straightforward', 'Standard', 'Readable', 'Parsed', 'Direct', 'Linear', 'Neutral', 'Classic Clean', 'Scan Ready'],
  professional: ['Boardroom', 'Ledger', 'Compass', 'Meridian', 'Pinnacle', 'Anchor', 'Harbor', 'Cornerstone', 'Summit', 'Atlas', 'Charter', 'Keystone', 'Vantage'],
  modern: ['Aurora', 'Horizon', 'Prism', 'Lumen', 'Echo', 'Drift', 'Pulse', 'Nova', 'Bloom', 'Orbit', 'Flux', 'Zenith', 'Wave'],
  creative: ['Canvas', 'Spark', 'Mosaic', 'Palette', 'Studio', 'Muse', 'Kaleido', 'Ink', 'Sketch', 'Fable', 'Brush', 'Collage'],
  simple: ['Plain', 'Whisper', 'Breeze', 'Minimal', 'Calm', 'Clean Slate', 'Soft', 'Quiet', 'Basic', 'Light', 'Essential', 'Pure'],
  student: ['Campus', 'First Step', 'Scholar', 'Launchpad', 'Intern', 'Fresh Start', 'Graduate', 'Rookie', 'Bright', 'Starter', 'Learner', 'Cadet'],
  executive: ['Chairman', 'Regent', 'Sovereign', 'Directorate', 'Legacy', 'Principal', 'Chancery', 'Magnate', 'Senate', 'Crest', 'Heritage', 'Apex', 'Doyen'],
  tech: ['Compile', 'Kernel', 'Stack', 'Commit', 'Binary', 'Syntax', 'Node', 'Deploy', 'Cache', 'Pipeline', 'Vector', 'Runtime', 'Branch'],
};
function build() {
  const out = []; let id = 1;
  for (const cat of CATEGORIES) {
    const sp = SPEC[cat.slug];
    for (let k = 0; k < sp.n; k++) {
      const st = sp.structs[k % sp.structs.length];
      const font = sp.fonts[(k * 5 + Math.floor(k / sp.structs.length)) % sp.fonts.length];
      const pal = sp.pal[(k * 3 + Math.floor(k / 4)) % sp.pal.length];
      out.push({
        id: `t${String(id++).padStart(3, '0')}`, name: NAMES[cat.slug][k], category: cat.slug,
        layout: st.layout, header: st.header, tone: st.tone,
        heading: sp.heads[(k + Math.floor(k / 5)) % sp.heads.length],
        bullet: sp.bullets[(k * 2 + 1) % sp.bullets.length],
        date: sp.dates[(k + 1) % sp.dates.length],
        skill: sp.skills[(k * 2) % sp.skills.length],
        font, palette: pal, size: sp.size, eduFirst: !!sp.eduFirst,
      });
    }
  }
  return out;
}
export const TEMPLATES = build();
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
export const templatesByCategory = (slug) => TEMPLATES.filter((t) => t.category === slug);

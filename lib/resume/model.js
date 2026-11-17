export const SECTION_TYPES = {
  summary: { label: 'Summary', kind: 'text', title: 'Professional Summary' },
  experience: { label: 'Experience', kind: 'entries', title: 'Work Experience', f: ['Job title', 'Company', 'Location'] },
  education: { label: 'Education', kind: 'entries', title: 'Education', f: ['Degree / course', 'School', 'Location'] },
  projects: { label: 'Projects', kind: 'entries', title: 'Projects', f: ['Project name', 'Role or link', 'Location'] },
  skills: { label: 'Skills', kind: 'tags', title: 'Skills' },
  certifications: { label: 'Certifications', kind: 'entries', title: 'Certifications', f: ['Certificate', 'Issuer', ''] },
  awards: { label: 'Awards', kind: 'entries', title: 'Awards', f: ['Award', 'Given by', ''] },
  volunteer: { label: 'Volunteering', kind: 'entries', title: 'Volunteering', f: ['Role', 'Organisation', 'Location'] },
  languages: { label: 'Languages', kind: 'tags', title: 'Languages' },
  interests: { label: 'Interests', kind: 'tags', title: 'Interests' },
  custom: { label: 'Custom section', kind: 'entries', title: 'Custom Section', f: ['Heading', 'Subheading', 'Location'] },
};
export const SIDE_TYPES = ['skills', 'languages', 'certifications', 'interests', 'awards'];
export const uid = () => Math.random().toString(36).slice(2, 9);
export const newEntry = (o = {}) => ({ id: uid(), title: '', subtitle: '', location: '', start: '', end: '', text: '', ...o });
export const newSection = (type) => {
  const t = SECTION_TYPES[type];
  return { id: uid(), type, title: t.title, visible: true, text: '', items: t.kind === 'entries' ? [newEntry()] : [] };
};
export const emptyResume = () => ({
  personal: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '' },
  sections: ['summary', 'experience', 'education', 'skills'].map(newSection),
});
export const sampleResume = () => ({
  personal: { name: 'Alex Morgan', title: 'Marketing Analyst', email: 'alex.morgan@email.com', phone: '+1 555 014 2290', location: 'Austin, TX', website: 'alexmorgan.dev', linkedin: 'linkedin.com/in/alexmorgan' },
  sections: [
    { id: uid(), type: 'summary', title: 'Professional Summary', visible: true, items: [], text: 'Analytical marketing professional with four years of experience turning campaign data into clear decisions. Comfortable moving between spreadsheets, dashboards and stakeholder updates, with a record of improving conversion while lowering acquisition cost.' },
    { id: uid(), type: 'experience', title: 'Work Experience', visible: true, text: '', items: [
      newEntry({ title: 'Marketing Analyst', subtitle: 'Northwind Retail', location: 'Austin, TX', start: 'Mar 2022', end: 'Present', text: 'Built a weekly performance dashboard that cut reporting time from six hours to one\nTested subject lines and landing pages, lifting email conversion by 18% over two quarters\nPartnered with sales to define lead scoring used across three regions' }),
      newEntry({ title: 'Junior Marketing Associate', subtitle: 'Brightside Media', location: 'Dallas, TX', start: 'Jun 2020', end: 'Feb 2022', text: 'Managed paid social budgets of $25k per month across four channels\nProduced monthly insight decks for clients, retaining all five accounts' }),
    ] },
    { id: uid(), type: 'education', title: 'Education', visible: true, text: '', items: [newEntry({ title: 'B.A. in Communications', subtitle: 'University of Texas at Austin', location: 'Austin, TX', start: '2016', end: '2020', text: 'Minor in Statistics. Dean’s list, four semesters.' })] },
    { id: uid(), type: 'skills', title: 'Skills', visible: true, items: [], text: 'Google Analytics, SQL, Excel, Looker Studio, A/B testing, SEO, Copywriting, Stakeholder reporting' },
    { id: uid(), type: 'projects', title: 'Projects', visible: true, text: '', items: [newEntry({ title: 'Local Business Dashboard', subtitle: 'Volunteer analyst', text: 'Created a free analytics template used by 40+ small shops\nDocumented setup in a two-page guide' })] },
    { id: uid(), type: 'languages', title: 'Languages', visible: true, items: [], text: 'English (Native), Spanish (Intermediate)' },
  ],
});
export const tags = (t) => String(t || '').split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
export const DEFAULT_SETTINGS = { paper: 'a4', scale: 1, accent: '' };

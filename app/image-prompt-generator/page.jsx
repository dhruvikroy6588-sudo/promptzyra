import ImagePromptBuilder from '@/components/ImagePromptBuilder';

export const metadata = {
  title: 'Free AI Image Prompt Builder | GPT Image, Gemini & Midjourney',
  description: 'Build detailed AI image prompts for GPT Image, Gemini, Midjourney and Flux. Choose style, lighting, camera, composition and aspect ratio with Promptzyra’s free prompt builder.',
  alternates: { canonical: 'https://promptzyra.com/image-prompt-generator' },
  openGraph: {
    title: 'Free AI Image Prompt Builder | Promptzyra',
    description: 'Turn a simple idea into a structured AI image prompt. Free, browser-based and no API key required.',
    url: 'https://promptzyra.com/image-prompt-generator',
    type: 'website'
  }
};

export default function ImagePromptGeneratorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Promptzyra AI Image Prompt Builder',
    url: 'https://promptzyra.com/image-prompt-generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    description: 'A free browser-based tool for building structured prompts for AI image generation.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><ImagePromptBuilder /></>;
}

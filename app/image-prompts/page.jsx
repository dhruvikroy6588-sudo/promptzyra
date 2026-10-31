import ImagePromptGallery from '@/components/ImagePromptGallery';
export const dynamic='force-dynamic';
export const metadata={title:'AI Image Prompt Gallery — Browse Visual Prompts',description:'Explore a visual gallery of AI image prompts. Search creative examples, filter by GPT Image, Gemini, Midjourney, Flux and tags, then copy or customize prompts.',alternates:{canonical:'https://promptzyra.com/image-prompts'},openGraph:{title:'AI Image Prompt Gallery | Promptzyra',description:'Browse image prompt previews, model filters and creative tags.',url:'https://promptzyra.com/image-prompts',type:'website'},twitter:{card:'summary_large_image',title:'AI Image Prompt Gallery | Promptzyra'}};
export default function ImagePromptsPage(){return <ImagePromptGallery/>}

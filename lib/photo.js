// Constants and original landing-page copy for the Photo Prompts section.
export const PHOTO_PAGE_SIZE = 24;
export const PHOTO_TOOLS = [
  { id: 'gemini', label: 'Gemini' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'midjourney', label: 'Midjourney' },
];
export const photoToolLabel = (id) => (id === 'any' || !id ? 'Any AI tool' : PHOTO_TOOLS.find((t) => t.id === id)?.label || id);

export const PHOTO_SUBJECTS = [
  { id: 'men', label: 'Men', intro: 'Prompts for portraits and styled photos of men: clean headshots, cinematic looks, travel and lifestyle scenes. Upload your own photo, paste the prompt and ask the AI to keep your face and proportions the same while it changes the setting, outfit and lighting.' },
  { id: 'women', label: 'Women', intro: 'Prompts for styled photos of women, from soft editorial portraits to festive and fashion-inspired looks. Each one is written to be used together with your own picture, so the result still looks like you rather than a stranger.' },
  { id: 'couple', label: 'Couple', intro: 'Prompts for couple photos: anniversaries, save-the-date style scenes and romantic illustrations. Upload a picture of the two of you that you both agree to use, then paste the prompt and ask the AI to keep both faces consistent.' },
  { id: 'family', label: 'Family', intro: 'Prompts for family portraits and festive family scenes. Use a group photo you own, or one where everyone in it is happy for you to edit it, and let the prompt handle the background, clothing style and mood.' },
  { id: 'kids', label: 'Kids', intro: 'Prompts for playful, storybook and costume-style photos of children. Only use pictures of your own children or children you have a guardian\'s permission to edit, and think before sharing the results publicly.' },
  { id: 'pets', label: 'Pets', intro: 'Prompts that turn a photo of your dog, cat or other pet into portraits, cartoons and cosy scenes. Upload a clear, well-lit picture of your pet and ask the AI to keep its markings and colours exactly as they are.' },
  { id: 'birthday', label: 'Birthday', intro: 'Prompts for birthday photos, cards and party-style images. Add your own picture, adjust the age, theme and colours in the prompt, then generate a personal image for an invitation or a greeting.' },
  { id: 'portrait', label: 'Portrait', intro: 'Prompts for single-person portraits and profile pictures: studio lighting, soft backgrounds, painterly and cinematic styles. Great for a profile image when you want a polished look from a casual photo.' },
];
export const photoSubjectLabel = (id) => PHOTO_SUBJECTS.find((s) => s.id === id)?.label || (id ? id.charAt(0).toUpperCase() + id.slice(1) : '');

export const PHOTO_TOOL_INTRO = {
  gemini: 'Gemini can edit a photo you upload from a plain-language instruction. These prompts are written for that workflow: attach your own picture, paste the prompt, and ask Gemini to keep your face and identity unchanged while it applies the style.',
  chatgpt: 'ChatGPT can take an uploaded photo and generate a new image in a requested style. These prompts are written for that workflow: upload your own picture, paste the prompt and refine the result with short follow-up messages.',
  midjourney: 'Midjourney can use an image you provide as a reference alongside a text prompt. These prompts are written to be used with your own reference photo, and you can tune how closely the result follows it using the tool\'s own image-weight setting.',
};

export const PHOTO_HOW_TO = [
  { t: 'Upload your own photo', d: 'Open your AI tool and attach a clear, well-lit photo of yourself, or of someone who has agreed to be in it.' },
  { t: 'Paste the prompt', d: 'Copy the prompt from this page, paste it into the chat next to your photo and replace any bracketed details with your own.' },
  { t: 'Keep face and identity consistent', d: 'Add a line such as "keep my face, features and proportions exactly the same" if the first result drifts away from the original.' },
  { t: 'Regenerate and adjust', d: 'Ask for small changes in follow-ups, such as lighting, outfit or background, and try again until you like the result.' },
];

export const PHOTO_SAFETY = [
  'Use only photos you own or have permission to use.',
  'Do not use another person\'s photo without their consent.',
  'Do not create misleading or impersonating images of real people.',
  'Label AI-generated images as AI-generated when you share them.',
];

export const PHOTO_FAQ = [
  { q: 'How do I use a photo prompt?', a: 'Upload your own photo to Gemini, ChatGPT or Midjourney, paste the prompt next to it and generate. Then ask for small changes until the result suits you.' },
  { q: 'Will the result look like me?', a: 'Often, but not always. Adding an instruction to keep your face, features and proportions unchanged helps, and a sharp, front-facing photo usually gives the best likeness.' },
  { q: 'Are these prompts free?', a: 'Yes, copying the prompts is free. The AI tool you paste them into may have its own limits or pricing.' },
  { q: 'Can I use these images commercially?', a: 'That depends on the terms of the AI tool you use and on whether you have the rights to the photo you uploaded. Check the tool\'s terms before using results for business.' },
  { q: 'Is it safe to upload my photo?', a: 'Read the privacy settings of the AI tool before uploading. Avoid photos with sensitive background details, and never upload photos of other people without their consent.' },
];

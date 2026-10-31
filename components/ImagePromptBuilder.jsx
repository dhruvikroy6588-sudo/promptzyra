'use client';

import { useMemo, useState } from 'react';
import { Copy, RotateCcw, Sparkles, Check, WandSparkles } from 'lucide-react';

const OPTIONS = {
  model: ['GPT Image', 'Gemini', 'Midjourney', 'Flux', 'Stable Diffusion', 'Adobe Firefly'],
  style: ['Photorealistic editorial', 'Cinematic photography', '3D illustration', 'Minimal vector art', 'Luxury product photography', 'Fashion editorial', 'Watercolor illustration', 'Anime-inspired illustration'],
  mood: ['Warm and uplifting', 'Moody and dramatic', 'Dreamy and ethereal', 'Clean and premium', 'Playful and colorful', 'Calm and minimal'],
  lighting: ['Soft natural window light', 'Golden hour sunlight', 'Studio softbox lighting', 'Dramatic chiaroscuro', 'Neon rim lighting', 'Overcast diffused light'],
  camera: ['85mm portrait lens, shallow depth of field', '50mm natural perspective', '35mm environmental composition', 'Macro close-up detail', 'Wide-angle architectural view', 'Top-down flat lay'],
  composition: ['Centered hero composition', 'Rule-of-thirds composition', 'Close-up crop', 'Wide cinematic frame', 'Symmetrical composition', 'Negative space for typography'],
  ratio: ['4:5 portrait', '3:4 portrait', '1:1 square', '3:2 landscape', '16:9 widescreen', '9:16 vertical'],
};

const initial = { subject: '', details: '', model: 'GPT Image', style: OPTIONS.style[0], mood: OPTIONS.mood[0], lighting: OPTIONS.lighting[0], camera: OPTIONS.camera[0], composition: OPTIONS.composition[0], ratio: OPTIONS.ratio[0], colors: '', background: '', negative: 'blurry, distorted anatomy, extra fingers, text artifacts, watermark, low resolution' };

function SelectField({ label, value, options, onChange }) {
  return <label className="ipb-field"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}

export default function ImagePromptBuilder() {
  const [form, setForm] = useState(initial);
  const [copied, setCopied] = useState(false);
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const prompt = useMemo(() => {
    const subject = form.subject.trim() || '[Describe your main subject]';
    const parts = [
      `Create an image of ${subject}.`,
      form.details.trim() ? `Important details: ${form.details.trim()}.` : '',
      `Visual direction: ${form.style.toLowerCase()}, ${form.mood.toLowerCase()}.`,
      `Lighting: ${form.lighting.toLowerCase()}.`,
      `Camera and viewpoint: ${form.camera.toLowerCase()}.`,
      `Composition: ${form.composition.toLowerCase()}.`,
      form.background.trim() ? `Environment and background: ${form.background.trim()}.` : '',
      form.colors.trim() ? `Color palette: ${form.colors.trim()}.` : '',
      `Aspect ratio: ${form.ratio}.`,
      'Prioritize coherent details, realistic materials, clean edges, balanced exposure, and a visually clear focal point.'
    ].filter(Boolean);
    return parts.join(' ');
  }, [form]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${prompt}\n\nNegative prompt: ${form.negative || 'None'}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const field = document.createElement('textarea');
      field.value = `${prompt}\n\nNegative prompt: ${form.negative || 'None'}`;
      field.setAttribute('readonly', '');
      field.style.position = 'absolute';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(field);
      setCopied(Boolean(ok));
      if (ok) window.setTimeout(() => setCopied(false), 1800);
    }
  };
  const reset = () => setForm(initial);

  return <main className="ipb-page">
    <section className="ipb-hero">
      <div className="ipb-eyebrow"><WandSparkles size={15}/> FREE CREATOR TOOL</div>
      <h1>AI Image <em>Prompt Builder</em></h1>
      <p>Turn a simple idea into a structured image prompt. Choose a visual style, lighting, camera, composition and aspect ratio — then copy it into your image generator.</p>
      <div className="ipb-pills"><span><Sparkles size={14}/> No sign-up</span><span>Runs in your browser</span><span>No API key required</span></div>
    </section>

    <section className="ipb-layout" aria-label="Image prompt builder">
      <div className="ipb-panel ipb-controls">
        <div className="ipb-panel-heading"><div><span className="ipb-step">STEP 01</span><h2>Build your visual</h2></div><button type="button" className="ipb-reset" onClick={reset}><RotateCcw size={14}/> Reset</button></div>
        <label className="ipb-field"><span>Main subject <b>*</b></span><input value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="e.g. A confident young woman in a modern white outfit" maxLength={220}/></label>
        <label className="ipb-field"><span>Extra details</span><textarea value={form.details} onChange={e => update('details', e.target.value)} placeholder="Describe pose, clothing, objects, textures or specific features..." rows={3} maxLength={600}/></label>
        <div className="ipb-field-grid">
          <SelectField label="Target image tool" value={form.model} options={OPTIONS.model} onChange={v=>update('model',v)}/>
          <SelectField label="Visual style" value={form.style} options={OPTIONS.style} onChange={v=>update('style',v)}/>
          <SelectField label="Mood" value={form.mood} options={OPTIONS.mood} onChange={v=>update('mood',v)}/>
          <SelectField label="Lighting" value={form.lighting} options={OPTIONS.lighting} onChange={v=>update('lighting',v)}/>
          <SelectField label="Camera / viewpoint" value={form.camera} options={OPTIONS.camera} onChange={v=>update('camera',v)}/>
          <SelectField label="Composition" value={form.composition} options={OPTIONS.composition} onChange={v=>update('composition',v)}/>
          <SelectField label="Aspect ratio" value={form.ratio} options={OPTIONS.ratio} onChange={v=>update('ratio',v)}/>
        </div>
        <label className="ipb-field"><span>Color palette <small>(optional)</small></span><input value={form.colors} onChange={e=>update('colors',e.target.value)} placeholder="e.g. warm beige, ivory, muted gold" maxLength={160}/></label>
        <label className="ipb-field"><span>Background / environment <small>(optional)</small></span><input value={form.background} onChange={e=>update('background',e.target.value)} placeholder="e.g. minimalist beige studio with soft shadows" maxLength={200}/></label>
      </div>

      <aside className="ipb-panel ipb-output">
        <div className="ipb-panel-heading"><div><span className="ipb-step">STEP 02</span><h2>Your prompt</h2></div><span className="ipb-live"><i/> LIVE PREVIEW</span></div>
        <div className="ipb-output-meta"><span>{form.model}</span><span>{form.ratio}</span></div>
        <div className="ipb-prompt-text" aria-live="polite">{prompt}</div>
        <label className="ipb-field ipb-negative"><span>Negative prompt</span><textarea value={form.negative} onChange={e=>update('negative',e.target.value)} rows={3} maxLength={400}/></label>
        <button type="button" className="ipb-copy" onClick={copy}><Copy size={17}/>{copied ? 'Copied to clipboard' : 'Copy complete prompt'}{copied && <Check size={16}/>}</button>
        <p className="ipb-note">This tool creates prompt text only. Paste it into your selected image-generation app. Results vary by model and settings.</p>
      </aside>
    </section>
    <section className="ipb-seo-copy"><h2>How to write better AI image prompts</h2><p>Start with a clear subject, then describe the visual style, lighting, camera viewpoint, composition and color palette. Specific details help image models understand the scene you want. Keep the prompt focused, avoid contradictory instructions, and refine one element at a time after reviewing the generated image.</p><h3>Does this image prompt builder generate images?</h3><p>No. Promptzyra builds structured text prompts locally in your browser. Copy the result into GPT Image, Gemini, Midjourney, Flux or another compatible image-generation tool to create your image.</p></section>
  </main>;
}

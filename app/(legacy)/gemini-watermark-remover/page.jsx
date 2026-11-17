import Link from "next/link";
import { ArrowRight, CheckCircle2, Image, ShieldCheck, Sparkles } from "lucide-react";
import GeminiImageRemover from "@/components/GeminiImageRemover";

export const metadata = {
  title: "Free Gemini Image Watermark Remover | Promptzyra",
  description: "Try Promptzyra's free browser-based Gemini image watermark tool. Upload a supported Gemini image, preview processing, and download a PNG.",
  alternates: { canonical: "https://promptzyra.com/gemini-watermark-remover" },
  openGraph: {
    title: "Free Gemini Image Watermark Remover | Promptzyra",
    description: "Process supported Gemini images locally in your browser, preview the result, and download a PNG.",
    url: "https://promptzyra.com/gemini-watermark-remover",
    type: "website"
  }
};

export default function WatermarkGuide() {
  return <main className="about-page remover-page">
    <div className="section-kicker"><Sparkles size={15}/> PROMPTZYRA CREATOR TOOLKIT</div>
    <h1>Gemini image tool, <em>made simple.</em></h1>
    <p className="remover-intro">Upload a Gemini-generated image to try a local processing workflow. This tool targets supported visible Gemini watermark patterns; results depend on image dimensions and how the image was exported or edited.</p>
    <GeminiImageRemover />
    <section className="remover-info-section">
      <div className="section-kicker">HOW IT WORKS</div>
      <h2>Simple steps, with your image kept local.</h2>
      <div className="about-grid">
        <div><Image size={22}/><h3>1. Choose an image</h3><p>Select a Gemini-generated PNG, JPG, or WebP image from your device. Files up to 20 MB are accepted.</p></div>
        <div><Sparkles size={22}/><h3>2. Process and review</h3><p>The browser-side engine checks for a supported visible watermark pattern. It may leave unsupported images unchanged or show residual artifacts.</p></div>
        <div><CheckCircle2 size={22}/><h3>3. Download if suitable</h3><p>Preview the processed result before saving. Output is provided as PNG so it can be checked before further editing.</p></div>
      </div>
    </section>
    <section className="remover-notice">
      <h2><ShieldCheck size={20}/> Responsible use and limitations</h2>
      <p>Use this tool only on images you own or are authorized to edit, and preserve attribution or provenance marks where required by the provider’s terms, licenses, or your publishing context. This tool targets a visible watermark only; it does not remove invisible SynthID or other embedded provenance signals. No removal method is guaranteed to work on every image.</p>
      <p>The image engine is based on the open-source <a href="https://github.com/GargantuaX/gemini-watermark-remover" target="_blank" rel="noreferrer">GargantuaX Gemini Watermark Remover</a> project, distributed under the MIT License. See the project repository for license details and source history.</p>
    </section>
    <p><Link className="section-link" href="/">Explore copy-ready AI prompts <ArrowRight size={16}/></Link></p>
  </main>;
}

# Promptzyra Poster Prompt Library

## Included in this build
- 100 original Promptzyra poster prompt records in `data/poster-prompts.json`.
- 100 lightweight local SVG layout-study previews in `public/poster-previews/`.
- 18 visual art-direction labels used across the original prompt records.
- Gallery page: `/poster-prompts`.
- Individual SEO detail pages: `/poster-prompts/[slug]`.
- Search, category filter, style filter, copy prompt, negative prompt, and builder links.
- Sitemap entries for the hub and all 100 prompt detail pages.

The SVGs are illustrative layout studies made for Promptzyra. They are not represented as AI-generated final artwork or as images from third-party repositories.

## External open-source references
These are linked from the poster library as inspiration and research sources. Their code, prompts, preview images, and datasets are not automatically treated as one common license.

- The Art Director: https://github.com/sijingsun/the-art-director (repository MIT license; check included assets and files individually).
- AI Visual Prompt Cookbook: https://github.com/zyt-ngchwanlii/ai-visual-prompt-cookbook (repository materials and individual style files can have different terms; prompt styles state CC BY 4.0 in repository documentation; credit the author when reusing them).
- GPT Image prompt collection: https://github.com/Pixmind-io/awesome-gpt-image-2-prompts (use as a discovery/reference source; do not assume all community prompt text or images are licensed for republication).
- Community GPT Image prompts: https://github.com/youart-open-source/awesome-gpt-image-2-5-prompts (prompts retain their original authorship/source and terms; this build links to the source rather than republishing prompt text or images).
- Large poster/image prompt archive: https://github.com/no-chili/awesome-gpt-image-2-prompts (check its current license and each visual reference's rights before copying assets).
- Poster101K research dataset: research/reference use only unless the dataset card explicitly grants commercial redistribution rights for the particular assets.

## Database and runtime
No SQL migration or external API key is required. The 100 original poster entries are bundled as static JSON and their SVG preview files are local assets. Gallery filtering happens in the browser. Detail pages are generated from the bundled JSON. This avoids an extra Supabase query for the poster library and avoids third-party image hotlinks.

- Poster101K research dataset: https://github.com/AnonymousDog10/Poster101K (CC BY-NC-ND 4.0; non-commercial/no-derivatives; not imported into the commercial gallery).
- PosterCraft Poster100K: https://huggingface.co/datasets/PosterCraft/Poster100K (CC BY-NC-SA 4.0; non-commercial share-alike; linked for research only).
- GenPoster100K: https://huggingface.co/datasets/creative-graphic-design/GenPoster100K (CC BY-NC 4.0; non-commercial; not imported).

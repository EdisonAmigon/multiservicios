# CLAUDE.md — Website Creation from Reference Images

## Project Goal
Build production-ready, pixel-accurate (or strongly matching) websites from provided reference images. Prioritize visual fidelity to the reference while producing clean, modern, responsive, deployable code.

## Core Rules (Never Violate)
- When a reference image is provided: Match layout, spacing, hierarchy, color relationships, typography scale, component proportions, and overall aesthetic as closely as possible. Use the reference as the primary source of truth.
- Do NOT invent major new sections or “improve” the design beyond the reference unless explicitly asked.
- Prefer single-file HTML (inline CSS + JS) for rapid prototypes unless a framework is requested.
- Always produce fully responsive designs (mobile-first: 375px → 768px → 1440px+).
- Write real, conversion-oriented copy based on project details. Never use lorem ipsum or generic placeholders.
- Use modern CSS (Flexbox + Grid). Prefer Tailwind CDN or pure CSS. Avoid outdated patterns.
- Subtle, purposeful animations only (GSAP/ScrollTrigger or CSS transitions preferred). No bounce, spin, or excessive motion.
- Accessibility baseline: semantic HTML, proper contrast, alt text, keyboard-friendly.
- When images are needed and no assets are provided, use high-quality Unsplash/placeholder URLs or leave clear placeholders with exact dimensions matching the reference.

## Workflow When Reference Image Is Given
1. Analyze the reference thoroughly (layout structure, color palette extraction, type scale, spacing system, interactive states if visible).
2. Extract or invent a coherent design system (CSS variables for colors, fonts, spacing, radii, shadows) that matches the reference.
3. Build section by section if the site is complex; otherwise one-shot the full page.
4. After generation: Take a screenshot of the result (same viewport as reference if possible), compare side-by-side, and iterate until visual match is high (≥90% fidelity on layout, spacing, colors, and hierarchy). Repeat comparison rounds as needed.
5. Output clean, commented code only when requested; otherwise deliver the complete working file(s).

## Design System Defaults (Override with Reference)
- Colors: Derive primary, secondary, accent, background, text from the reference image.
- Typography: Match the reference’s font personality (serif/sans, weight, tracking). Use Google Fonts CDN.
- Spacing: Follow the visual rhythm of the reference (generous whitespace preferred unless the ref is dense).
- Components: Cards, buttons, nav, forms should mirror the reference’s style (rounded corners, shadows, glass effects, etc.).

## Tech Preferences
- Stack preference: HTML + Tailwind CSS (CDN) + minimal vanilla JS or GSAP for animation. React/Vite/Next only if requested.
- Images: Placeholders with exact aspect ratios from the reference. Support for user-provided assets in `/public` or similar.
- Deployment-ready: Single `index.html` preferred for quick Netlify/Vercel drop.

## Iteration Style
- Be precise and visual. When refining, reference specific elements (“the hero headline size and tracking”, “the card gap and shadow”).
- Always confirm visual match against the provided reference before declaring done.
- Ask clarifying questions only if critical details (brand name, exact copy, missing sections) are absent.

## Output Format
- Prefer complete, copy-paste-ready files.
- Include a short note only if something in the reference was ambiguous and you made a reasoned choice.
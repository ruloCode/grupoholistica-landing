# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML landing page for Grupo Holística, a Colombian reputation management consulting firm. No build tools or framework dependencies—vanilla HTML5, CSS3, and JavaScript.

**Deployment:** Vercel (auto-deploys on push to main branch)

## Development Commands

```bash
# Start local server (choose one)
python -m http.server 3000
npx serve
open index.html

# Deploy (automatic on push to main, or manual)
vercel deploy
```

No build process required—edit files directly and refresh browser.

## Architecture

### File Structure
- `index.html` - Single-page structure with all sections
- `styles.css` - CSS custom properties, Grid/Flexbox layouts, animations
- `main.js` - 8 vanilla JS modules for interactivity

### JavaScript Modules (main.js)
1. `initNavigation()` - Sticky navbar, mobile hamburger menu
2. `initScrollAnimations()` - Intersection Observer fade-in effects
3. `initCounterAnimations()` - Number counting with easing
4. `initSmoothScroll()` - Anchor link navigation
5. `initTestimonialDots()` - Carousel dot indicators
6. `initHorizontalScrollIndicators()` - Mobile scroll hints
7. `initHeroSlider()` - Auto-rotating hero (6s interval, touch/keyboard support)
8. `initLucideIcons()` - SVG icon initialization

### CSS Design System
Colors defined as CSS custom properties in `:root`:
- Primary: `#002237` (dark blue), Accent: `#2ea3f2`, Secondary: `#29c4a9`
- Service-specific brand colors for each of 7 services

Breakpoint: `768px` for mobile responsiveness

### External Dependencies (CDN)
- Lucide Icons (SVG icons via `data-lucide` attributes)
- Google Fonts: Work Sans (headings), Open Sans (body)

## Page Sections

Hero slider → Services (7 cards) → Why Us (4 features + 96% stat) → Testimonials (3 cards) → CTA → Footer

WhatsApp floating button fixed at bottom-right.

## Key Patterns

- Icons use `data-lucide="icon-name"` attribute
- Animations trigger via `.fade-up` class with Intersection Observer
- Counter elements use `data-count` or `data-target` attributes
- Mobile menu controlled by `.nav-links.active` class toggle

## Testing Checklist

When making changes, verify:
- Mobile responsiveness (375px, 768px, 1024px viewports)
- Hero slider auto-play and manual navigation
- Mobile menu open/close with Escape key
- Smooth scroll on anchor links
- WhatsApp button links to +57 314 3211799

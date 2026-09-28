# 📸 MomentCap Logo Guide

## Available Logo Versions

### 1. **logo-enhanced.svg** (RECOMMENDED)
- **Best for:** Main branding, hero sections, landing page
- **Aspect ratio:** Square (1:1)
- **Style:** Full graffiti bubble with camera icon
- **Elements:** "MOMENT CAP" text + camera frame + decorative elements
- **Use:** Website headers, app header, marketing materials

### 2. **logo-square.svg**
- **Best for:** Social media, app icon, profile pictures
- **Aspect ratio:** Square (1:1)
- **Style:** Camera prominent, stacked text below
- **Elements:** Large white camera + "MOMENT CAP" below
- **Use:** Instagram, Twitter, LinkedIn, Facebook

### 3. **logo-horizontal.svg**
- **Best for:** Banners, navigation bars, horizontal layouts
- **Aspect ratio:** Landscape (800×300)
- **Style:** Camera on left, text on right
- **Elements:** Camera icon + horizontal text
- **Use:** Website banner, email header, social media banner

### 4. **favicon.svg**
- **Best for:** Browser tab, favicon
- **Aspect ratio:** Square (1:1)
- **Style:** Compact camera icon
- **Elements:** Just the camera, minimal design
- **Use:** Browser favicon, small icons

### 5. **logo.svg**
- **Best for:** Fallback/basic version
- **Aspect ratio:** Square (1:1)
- **Style:** Simple design with emoji accent
- **Use:** Backup if others don't render

---

## Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Background | Golden Yellow | #FFD700 | Primary brand color |
| Text | White | #FFFFFF | Main text |
| Outline | Dark Gray | #333333 | Text outline effect |
| Accent | Yellow | #FFC700 | Secondary highlight |

---

## Implementation in Next.js

### In HTML Head (favicon)
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

### In React Component
```jsx
// Header logo
import Image from 'next/image'

<Image
  src="/logo-enhanced.svg"
  alt="MomentCap"
  width={200}
  height={200}
/>

// Horizontal banner
<Image
  src="/logo-horizontal.svg"
  alt="MomentCap"
  width={400}
  height={150}
/>

// Social icon
<Image
  src="/logo-square.svg"
  alt="MomentCap"
  width={100}
  height={100}
/>
```

---

## Usage Guidelines

### DO ✅
- Use on yellow, white, or light backgrounds
- Scale proportionally (maintain aspect ratio)
- Keep minimum size 64px for small icons
- Use favicon.svg for 16×16, 32×32 sizes

### DON'T ❌
- Don't rotate or skew the logo
- Don't change the color scheme
- Don't remove the camera element
- Don't use on dark backgrounds without adjustment
- Don't compress as PNG (keep as SVG for quality)

---

## Quick Usage

### Landing Page Hero
```html
<img src="/logo-enhanced.svg" alt="MomentCap" width="300" />
```

### Navigation Header
```html
<img src="/logo-horizontal.svg" alt="MomentCap" width="400" />
```

### Social Media Icon
```html
<img src="/logo-square.svg" alt="MomentCap" width="200" />
```

### Browser Tab (already set in next.config)
```html
<link rel="icon" href="/favicon.svg" />
```

---

## File Details

| File | Size | Format | Best For |
|------|------|--------|----------|
| logo-enhanced.svg | ~6KB | SVG | Main branding |
| logo-square.svg | ~4KB | SVG | Social media |
| logo-horizontal.svg | ~5KB | SVG | Banners |
| favicon.svg | ~2KB | SVG | Browser tab |
| logo.svg | ~3KB | SVG | Fallback |

---

## Design Specs

### Typography
- **Font Family:** Impact, Arial Black (bubble/graffiti style)
- **Weight:** 900 (ultra-bold)
- **Style:** Bubble graffiti with black outline
- **Effect:** White fill with dark gray stroke for depth

### Camera Icon
- **Shape:** Rounded square
- **Color:** White with yellow accents
- **Elements:**
  - Main lens (circle)
  - Flash indicator
  - Shutter direction markers

### Overall Style
- **Vibe:** Fun, youthful, authentic
- **Mood:** Casual but professional
- **Inspiration:** BeReal app aesthetic + camera culture

---

## Customization

If you want to modify the logos:

1. **Change colors:** Edit the `fill="#FFD700"` values
2. **Change text:** Edit the `<text>` elements
3. **Change camera style:** Modify the `<circle>` and `<rect>` elements
4. **Add effects:** Use `<filter>` elements for shadows/blur

---

## Downloads

All SVGs are ready to use directly from `/public/` folder.

For PNG export (if needed):
- Use SVG converter: https://cloudconvert.com/
- Recommended DPI: 300
- Format: PNG with transparent background

---

## Questions?

These logos are scalable, responsive, and designed to work across all platforms.

Use logo-enhanced.svg as your default. It's the most complete and visually appealing version! 🎨

---

**Created:** Sept 27, 2026
**Format:** SVG (vector, infinitely scalable)
**License:** Part of MomentCap branding

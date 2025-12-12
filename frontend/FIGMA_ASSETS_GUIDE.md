# Figma Assets Integration Guide

## Overview
This guide explains how to export images and icons from your Figma template and integrate them into the Blood Donation frontend.

---

## Step 1: Export Images from Figma

### How to Export from Figma:
1. **Select the element** (image, icon, or component) in your Figma design
2. **Right-click** → **Copy as** → **Copy as image** (or use the export panel on the right side)
3. Alternatively, use the **Export** tab on the right panel:
   - Select the element
   - Click **"+"** under the Export section
   - Choose format: **PNG** (recommended for quality) or **SVG** (for icons)
   - Click **Export**

### File Organization:
Create folders in `frontend/` for organized asset storage:
```
frontend/
├── images/
│   ├── hero-image.png         (main hero section)
│   ├── logo.png               (navbar logo if needed)
│   └── illustrations/         (optional: feature icons)
├── icons/
│   ├── search.svg             (icon for search)
│   ├── heart.svg              (icon for donor)
│   └── location.svg           (icon for zone)
└── styles/
    ├── fonts/                 (custom fonts from Figma)
```

---

## Step 2: Place Images Where They Apply

### **Hero Section** (`index.html` lines 48-52)
Replace the placeholder image URL:

**Current:**
```html
<div class="card card-illustration">
  <img src="https://images.unsplash.com/photo-1582281298059-9b1203b0e9bb?auto=format&fit=crop&w=800&q=60" alt="donation"/>
</div>
```

**Update to:**
```html
<div class="card card-illustration">
  <img src="images/hero-image.png" alt="Blood donation illustration"/>
</div>
```

### **Navbar Logo** (optional, if your Figma has a branded logo)
Replace the emoji `🩸` with an image:

**Current:**
```html
<div class="logo">🩸</div>
```

**Update to:**
```html
<div class="logo">
  <img src="images/logo.png" alt="Blood Donation Logo" style="height:32px; width:auto;"/>
</div>
```

### **Feature Cards Icons** (How it Works section, lines 115-130)
Replace emoji icons with SVG or PNG:

**Current:**
```html
<div class="small-card">
  <div class="icon">🔍</div>
  <h4>Search Donors</h4>
  <p>Find nearby donors by blood group and distance.</p>
</div>
```

**Update to:**
```html
<div class="small-card">
  <div class="icon">
    <img src="icons/search.svg" alt="Search icon"/>
  </div>
  <h4>Search Donors</h4>
  <p>Find nearby donors by blood group and distance.</p>
</div>
```

**Repeat for:**
- Request icon → `icons/request.svg` or `icons/document.svg`
- Notify icon → `icons/bell.svg` or `icons/message.svg`

---

## Step 3: Update CSS for Images

If you need to adjust image sizes or styling, add to `frontend/css/style.css`:

```css
/* Hero image adjustments */
.card-illustration img {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
  object-fit: cover; /* ensure proper aspect ratio */
}

/* Icon styling for cards */
.small-card .icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* Navbar logo styling */
.logo img {
  height: 32px;
  width: auto;
  display: block;
}
```

---

## Step 4: Optimize Images

### Best Practices:
1. **Use WebP or JPEG** for photographic images (smaller file size)
2. **Use PNG** for images with transparency
3. **Use SVG** for scalable icons (no quality loss at any size)

### Tools to Optimize:
- **TinyPNG** (https://tinypng.com/) — compress PNG/JPEG
- **SVGO** (https://svgo.dev/) — optimize SVG code
- **ImageMagick** — batch convert formats

Example PowerShell command to convert PNG to WebP:
```powershell
# Using ImageMagick (if installed)
magick convert images/hero-image.png -quality 80 images/hero-image.webp
```

---

## Step 5: Test Locally

After adding images:

1. **Serve the frontend:**
   ```powershell
   cd C:\Users\USER\Downloads\Blood-management-system\frontend
   python -m http.server 3000
   ```

2. **Open browser:** http://localhost:3000

3. **Check for:**
   - ✅ Images load (no broken icons)
   - ✅ Layout matches Figma (spacing, alignment)
   - ✅ Mobile responsive (shrink browser window)

---

## Step 6: Path Reference

All image paths are **relative** to the `frontend/` folder:

| Element | Path | Size |
|---------|------|------|
| Hero image | `images/hero-image.png` | 420px width recommended |
| Logo | `images/logo.png` | 32px height |
| Search icon | `icons/search.svg` | 48x48px |
| Request icon | `icons/request.svg` | 48x48px |
| Notify icon | `icons/notify.svg` | 48x48px |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Image doesn't load (404 error) | Check file path spelling and folder structure |
| Image is blurry on mobile | Use higher resolution; add `object-fit: cover` |
| SVG colors not showing | Ensure SVG is exported with colors embedded |
| Icon misaligned | Adjust `.icon img` CSS width/height |

---

## Example: Complete Updated Hero Section

```html
<header class="hero">
  <div class="container hero-inner">
    <div class="hero-left">
      <h1>Save lives. Donate blood.</h1>
      <p class="lead">Find compatible donors in your area or create a request for urgent needs.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="#search">Search Donors</a>
        <a class="btn btn-ghost" href="#request">Create Request</a>
      </div>
    </div>
    <div class="hero-right">
      <div class="card card-illustration">
        <img src="images/hero-image.png" alt="Blood donation illustration"/>
      </div>
    </div>
  </div>
</header>
```

---

## Next Steps
1. Export your Figma assets
2. Create `images/` and `icons/` folders
3. Copy exported files into respective folders
4. Update HTML `src` attributes (see Step 2)
5. Test locally and adjust CSS if needed

**Need help?** Check if your images are in the correct path and that file names match exactly (case-sensitive on Linux/Mac).

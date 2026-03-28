# GitHub Pages Naming Conflict Issue

## The Problem
Your repository is named `data-collector` and you're trying to serve from `/data-collector/` subdirectory. This creates a path conflict:
- Repository: `wilsad.github.io/data-collector`
- Expected path: `/data-collector/manifest.json`
- Actual path: `/data-collector/data-collector/manifest.json` (wrong!)

## Solutions

### Option 1: Rename Repository (Recommended)
1. Go to: https://github.com/Wilsad/data-collector/settings
2. Click "Settings" → "Repository name"
3. Change to: `data-collector-app` or `wippic-data-collector`
4. Update vite.config.js: `base: '/data-collector-app/'`

### Option 2: Change Base Path (Quick Fix)
Update vite.config.js to serve from root:
```javascript
base: '/',  // Serve from root, not /data-collector/
```

### Option 3: Use GitHub Actions (Best Practice)
Keep current setup but ensure GitHub Pages uses Actions deployment.

## Recommendation
**Option 1 (rename repository)** is the cleanest solution because:
- No path conflicts
- Clear URL structure
- Better SEO
- Easier maintenance

## Test URLs After Fix
- If renamed to `data-collector-app`: https://wilsad.github.io/data-collector-app/
- If using root base: https://wilsad.github.io/data-collector/

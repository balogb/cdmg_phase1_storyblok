# Icon Assets Required

This directory should contain the following icon files for full browser/device support.
Use a favicon generator like https://realfavicongenerator.net/ to create these from your logo.

## Required Files

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 16x16, 32x32, 48x48 | Browser tab icon (move to /app) |
| `icon-16x16.png` | 16x16 | Small favicon |
| `icon-32x32.png` | 32x32 | Standard favicon |
| `icon-192x192.png` | 192x192 | Android home screen |
| `icon-512x512.png` | 512x512 | Android splash screen / PWA |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `safari-pinned-tab.svg` | Vector | Safari pinned tab (monochrome) |

## Optional Files

| File | Size | Purpose |
|------|------|---------|
| `icon-384x384.png` | 384x384 | PWA icon |
| `mstile-150x150.png` | 150x150 | Windows tile |
| `og-image.png` | 1200x630 | Default social share image |

## Generation Steps

1. **Prepare source image**: Start with a square PNG, minimum 512x512px, ideally SVG
2. **Use generator**: Go to https://realfavicongenerator.net/
3. **Upload logo**: Upload your source image
4. **Configure options**:
   - iOS: Check "Add a solid, plain background" if logo has transparency
   - Android: Choose "Create all documented icons"
   - Windows: Choose appropriate background color
   - Safari: Upload SVG version or let it generate
5. **Download package**: Extract to this directory
6. **Update paths**: Ensure paths in `app/layout.tsx` match your filenames

## Color Reference

Update these in `manifest.json` and `layout.tsx`:
- Theme color (light): `#ffffff`
- Theme color (dark): `#1e3a8a`
- Background color: `#ffffff`
- Safari pinned tab color: `#2563eb`

## Verification

After adding icons, verify with:
- Chrome DevTools > Application > Manifest
- https://realfavicongenerator.net/favicon_checker
- Test on actual iOS/Android devices

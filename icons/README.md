# Icon Placeholder

The extension needs icons in three sizes:
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

You can create these using any image editor or online tool. Suggested icon theme:
- A paint palette emoji 🎨
- Purple/gradient colors matching the popup design
- Simple and recognizable at small sizes

## Quick Icon Generation Options:

1. **Use an online tool**: https://www.favicon-generator.org/
2. **Use ImageMagick** (if installed):
   ```bash
   convert -size 128x128 xc:none -gravity center -pointsize 100 -fill "#667eea" -annotate +0+0 "🎨" icon128.png
   convert icon128.png -resize 48x48 icon48.png
   convert icon128.png -resize 16x16 icon16.png
   ```

3. **Use Canva**: Create square images with the emoji/design

For now, the extension will work but Chrome will show a warning about missing icons.

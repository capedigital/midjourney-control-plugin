#!/bin/bash

# Package Midjourney Control Plugin for Chrome Web Store
# This creates a .zip file that can be uploaded to Chrome Web Store
# or shared with others for manual installation

VERSION="0.1.0"
OUTPUT_DIR="dist"
ZIP_NAME="midjourney-control-plugin-v${VERSION}.zip"

echo "📦 Packaging Midjourney Control Plugin v${VERSION}..."

# Create dist directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Remove old zip if it exists
rm -f "$OUTPUT_DIR/$ZIP_NAME"

# Files to include in the package
FILES=(
  "manifest.json"
  "background.js"
  "content.js"
  "popup.html"
  "popup.css"
  "popup.js"
  "icons"
)

# Create a temporary directory for packaging
TEMP_DIR=$(mktemp -d)
echo "📁 Creating temporary package directory..."

# Copy files to temp directory
for file in "${FILES[@]}"; do
  if [ -e "$file" ]; then
    if [ -d "$file" ]; then
      cp -r "$file" "$TEMP_DIR/"
    else
      cp "$file" "$TEMP_DIR/"
    fi
  else
    echo "⚠️  Warning: $file not found, skipping..."
  fi
done

# Create the zip file
echo "🗜️  Creating zip archive..."
cd "$TEMP_DIR"
zip -r "$ZIP_NAME" . -x "*.DS_Store" "*.git*" > /dev/null
cd - > /dev/null

# Move zip to dist directory
mv "$TEMP_DIR/$ZIP_NAME" "$OUTPUT_DIR/"

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Get file size
SIZE=$(du -h "$OUTPUT_DIR/$ZIP_NAME" | cut -f1)

echo "✅ Package created successfully!"
echo ""
echo "📦 Output: $OUTPUT_DIR/$ZIP_NAME"
echo "📊 Size: $SIZE"
echo ""
echo "Next steps:"
echo "  1. Test: Load unpacked extension from current directory"
echo "  2. Share: Send the .zip file to others for manual installation"
echo "  3. Publish: Upload to Chrome Web Store (requires developer account)"
echo ""
echo "To load the extension:"
echo "  1. Open Chrome and go to chrome://extensions/"
echo "  2. Enable 'Developer mode' (toggle in top right)"
echo "  3. Click 'Load unpacked' and select this directory"
echo "  OR"
echo "  4. Drag and drop the .zip file onto the extensions page"

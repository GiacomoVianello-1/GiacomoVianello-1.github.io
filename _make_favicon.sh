#!/bin/bash
set -e

SRC="images/UniPDlogo.png"
DEST="images/favicons"

mkdir -p "$DEST"

echo "Generating favicon PNG sizes in $DEST..."
convert -background transparent "$SRC" -resize 16x16 "$DEST/favicon-16x16.png"
convert -background transparent "$SRC" -resize 32x32 "$DEST/favicon-32x32.png"
convert -background transparent "$SRC" -resize 48x48 "$DEST/favicon-48x48.png"
convert -background transparent "$SRC" -resize 96x96 "$DEST/favicon-96x96.png"
convert -background transparent "$SRC" -resize 180x180 "$DEST/apple-touch-icon.png"
convert -background transparent "$SRC" -resize 192x192 "$DEST/favicon-192x192.png"
convert -background transparent "$SRC" -resize 512x512 "$DEST/favicon-512x512.png"

echo "Generating multi-resolution favicon.ico (48x48 primary)..."
convert -background transparent "$SRC" -define icon:auto-resize=48,32,16 "$DEST/favicon.ico"

# Keep a root copy of favicon.ico for legacy browsers and web crawlers that look directly at /favicon.ico
cp "$DEST/favicon.ico" favicon.ico

echo "Done! All favicons organized in $DEST/."

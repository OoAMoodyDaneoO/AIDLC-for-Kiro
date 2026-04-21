#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$SCRIPT_DIR/out"
mkdir -p "$OUT_DIR"

echo "📦 Building aidlc-shared..."
cd "$SCRIPT_DIR/aidlc-shared"
npm install 2>/dev/null || true
npx tsc
echo "   ✅ aidlc-shared built"

build_extension() {
  local ext_dir="$1"
  local ext_name="$(basename "$ext_dir")"
  echo "📦 Building $ext_name..."
  cd "$ext_dir"

  # Clean stale shared lib
  rm -rf node_modules/aidlc-shared

  npm install 2>/dev/null || true

  # Place shared lib compiled output BEFORE tsc so types resolve
  mkdir -p node_modules/aidlc-shared/out
  cp -r "$SCRIPT_DIR/aidlc-shared/out/"* node_modules/aidlc-shared/out/
  node -e "
    const fs = require('fs');
    const pkg = { name: 'aidlc-shared', version: '0.1.0', main: './out/index.js', types: './out/index.d.ts' };
    fs.writeFileSync('node_modules/aidlc-shared/package.json', JSON.stringify(pkg, null, 2));
  "

  # Now compile
  npx tsc

  # Package with vsce
  if command -v vsce &>/dev/null; then
    vsce package --out "$OUT_DIR/$ext_name.vsix" --allow-missing-repository
  elif npx --yes @vscode/vsce package --out "$OUT_DIR/$ext_name.vsix" --allow-missing-repository 2>/dev/null; then
    true
  else
    echo "   ⚠️  vsce not found. Install: npm install -g @vscode/vsce"
    echo "   ✅ $ext_name compiled (no .vsix)"
    return
  fi

  echo "   ✅ $ext_name.vsix → $OUT_DIR/"
}

if [ -n "$1" ]; then
  build_extension "$SCRIPT_DIR/$1"
else
  for dir in "$SCRIPT_DIR"/*/; do
    dir_name="$(basename "$dir")"
    if [ "$dir_name" = "aidlc-shared" ] || [ "$dir_name" = "out" ] || [[ "$dir_name" == .* ]]; then continue; fi
    if [ -f "$dir/package.json" ]; then build_extension "$dir"; fi
  done
fi
echo "🎉 Build complete!"

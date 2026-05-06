#!/usr/bin/env bash
# Rebuild bundle.js from the JSX sources. Run after editing any *.jsx file.
# Also run automatically by Netlify on every push.
set -e
cd "$(dirname "$0")"

# Install local devDependencies if missing (cheap no-op when already present).
if [ ! -d node_modules/@babel/standalone ]; then
  echo "Installing dependencies..."
  npm install --silent
fi

node -e "
const b = require('@babel/standalone');
const fs = require('fs');
const files = ['tweaks-panel.jsx','icons.jsx','data.jsx','card-image.jsx','card-picker.jsx','mana.jsx','donation-tiers.jsx','search.jsx','comments.jsx','modals.jsx','ruling-page.jsx','app.jsx'];
const parts = files.map(f => '/* ===== ' + f + ' ===== */\n' + b.transform(fs.readFileSync(f,'utf8'), {presets:['react','env'],plugins:['transform-class-properties','transform-object-rest-spread'],filename:f}).code);
fs.writeFileSync('bundle.js', parts.join('\n\n'));
console.log('bundle.js:', fs.statSync('bundle.js').size, 'bytes');
"

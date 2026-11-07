#!/bin/sh
# Rebuild data.js from both models. Run from the repo root: sh docs/growth-review/build-data.sh
set -e
dir=docs/growth-review
wb=$(npx -y tsx "$dir/warpblade-model.mts" "$PWD")
vs=$(node "$dir/vs-model.mjs")
printf 'window.WB = %s;\nwindow.VS = %s;\n' "$wb" "$vs" > "$dir/data.js"

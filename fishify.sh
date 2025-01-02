#!/bin/bash

favicon='<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><text y=%2224%22 font-size=%2232%22>🐟</text></svg>">'

find . -type f -name "*.html" | while read -r file; do
  if ! grep -q "$favicon" "$file"; then
    sed -i '' "/<\/head>/i\\
    $favicon
    " "$file"
    echo "Added favicon to: $file"
  else
    echo "Favicon already exists in: $file"
  fi
done
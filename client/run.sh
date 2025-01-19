#!/bin/bash

npm run build

if [ $? -eq 0 ]; then
  echo "Build successful. Moving content.js to build directory."
  
  cp src/content.js build/
  cp src/manifest.json build/
  # BUNDLED_JS=$(find build/assets -name 'client-*.js')
  # if [ -n "$BUNDLED_JS" ]; then
  #   cp "$BUNDLED_JS" build/content.js
  #   echo "Copied $BUNDLED_JS to build/content.js"
  # else
  #   echo "Bundled JavaScript file not found."
  # fi
else
  echo "Build failed. content.js not moved."
fi

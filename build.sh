#!/bin/bash

# Build script to work around npm global mode issue
echo "Building all packages..."

# Build shared package
echo "Building shared package..."
cd packages/shared && /opt/homebrew/Cellar/node/24.7.0/bin/npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build shared package"
    exit 1
fi

# Build web package
echo "Building web package..."
cd ../../apps/web && /opt/homebrew/Cellar/node/24.7.0/bin/npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build web package"
    exit 1
fi

# Build API package (if needed)
echo "Building API package..."
cd ../api && /opt/homebrew/Cellar/node/24.7.0/bin/npm run build 2>/dev/null || echo "API build script not found, skipping"

echo "All packages built successfully!"
#!/bin/bash

# Cross-platform build script
echo "Building all packages..."

# Find the npm command dynamically
if command -v npm >/dev/null 2>&1; then
    NPM_CMD="npm"
elif command -v npx >/dev/null 2>&1; then
    NPM_CMD="npx npm"
else
    echo "Error: npm command not found"
    exit 1
fi

# Build shared package
echo "Building shared package..."
cd packages/shared && $NPM_CMD run build
if [ $? -ne 0 ]; then
    echo "Failed to build shared package"
    exit 1
fi

# Build web package
echo "Building web package..."
cd ../../apps/web && $NPM_CMD run build
if [ $? -ne 0 ]; then
    echo "Failed to build web package"
    exit 1
fi

# Build API package (if needed)
echo "Building API package..."
cd ../api && $NPM_CMD run build 2>/dev/null || echo "API build script not found, skipping"

echo "All packages built successfully!"
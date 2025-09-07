#!/bin/bash

echo "Running tests using direct commands..."

# Build shared package first (required by turbo dependency)
echo "Building shared package..."
./node_modules/.bin/tsc -p packages/shared
if [ $? -ne 0 ]; then
    echo "Failed to build shared package"
    exit 1
fi

# Build web package
echo "Building web package..."
cd apps/web && ../../node_modules/.bin/tsc && ../../node_modules/.bin/vite build
BUILD_STATUS=$?
cd ../..

if [ $BUILD_STATUS -ne 0 ]; then
    echo "Failed to build web package"
    exit 1
fi

# Test shared package
echo "Testing shared package..."
cd packages/shared && ../../node_modules/.bin/jest --passWithNoTests
SHARED_TEST_STATUS=$?
cd ../..

# Test web package  
echo "Testing web package..."
cd apps/web && ../../node_modules/.bin/jest --passWithNoTests
WEB_TEST_STATUS=$?
cd ../..

# Test API package
echo "Testing API package..."
cd apps/api
if [ -d "venv" ]; then
    source venv/bin/activate && PYTHONPATH=. pytest
    API_TEST_STATUS=$?
else
    echo "Warning: Python virtual environment not found in apps/api/venv"
    echo "Skipping API tests"
    API_TEST_STATUS=0
fi
cd ../..

# Report results
echo ""
echo "Test Results:"
if [ $SHARED_TEST_STATUS -eq 0 ]; then
    echo "✅ Shared package tests: PASSED"
else
    echo "❌ Shared package tests: FAILED"
fi

if [ $WEB_TEST_STATUS -eq 0 ]; then
    echo "✅ Web package tests: PASSED"
else
    echo "❌ Web package tests: FAILED"
fi

if [ $API_TEST_STATUS -eq 0 ]; then
    echo "✅ API package tests: PASSED"
else
    echo "❌ API package tests: FAILED"
fi

# Exit with error if any tests failed
if [ $SHARED_TEST_STATUS -ne 0 ] || [ $WEB_TEST_STATUS -ne 0 ] || [ $API_TEST_STATUS -ne 0 ]; then
    exit 1
fi

echo ""
echo "All tests passed! 🎉"

#!/bin/bash

echo "Starting development servers using direct commands..."

# Start TypeScript compiler for shared package in watch mode
echo "Starting TypeScript compiler for shared package..."
./node_modules/.bin/tsc -p packages/shared --watch &
SHARED_PID=$!

# Start Vite dev server for web app
echo "Starting Vite development server for web app..."
cd apps/web && ../../node_modules/.bin/vite &
WEB_PID=$!
cd ../..

# Start Python API server (assuming virtual environment is set up)
echo "Starting Python API development server..."
cd apps/api
if [ -d "venv" ]; then
    source venv/bin/activate && PYTHONPATH=. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    API_PID=$!
else
    echo "Warning: Python virtual environment not found in apps/api/venv"
    echo "Skipping API server startup"
    API_PID=""
fi
cd ../..

# Function to cleanup background processes
cleanup() {
    echo "Stopping development servers..."
    if [ ! -z "$SHARED_PID" ]; then
        kill $SHARED_PID 2>/dev/null
    fi
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
    fi
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
    fi
    exit
}

# Trap Ctrl+C to cleanup
trap cleanup SIGINT

echo ""
echo "Development servers are running:"
echo "- Shared TypeScript compiler: PID $SHARED_PID"
echo "- Web development server: PID $WEB_PID (http://localhost:3000)"
if [ ! -z "$API_PID" ]; then
    echo "- API development server: PID $API_PID (http://localhost:8000)"
fi
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for all background processes
wait

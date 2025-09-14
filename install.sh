#!/bin/bash

# Automated Installation Script for Tenex Full-Stack Monorepo
# This script handles environment validation, dependency installation, and setup

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get OS type
get_os() {
    case "$(uname -s)" in
        Darwin*)    echo "macos" ;;
        Linux*)     echo "linux" ;;
        CYGWIN*)    echo "cygwin" ;;
        MINGW*)     echo "mingw" ;;
        *)          echo "unknown" ;;
    esac
}

# Function to validate Node.js version
validate_node_version() {
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version $(node -v) is valid"
}

# Function to validate Python version
validate_python_version() {
    if ! command_exists python3; then
        print_error "Python 3 is not installed. Please install Python 3.11+ and try again."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    PYTHON_MAJOR=$(echo "$PYTHON_VERSION" | cut -d'.' -f1)
    PYTHON_MINOR=$(echo "$PYTHON_VERSION" | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
        print_error "Python version 3.11 or higher is required. Current version: $PYTHON_VERSION"
        exit 1
    fi
    
    print_success "Python version $PYTHON_VERSION is valid"
}

# Function to check Docker
check_docker() {
    if ! command_exists docker; then
        print_warning "Docker is not installed. Docker setup will be skipped."
        return 1
    fi
    
    if ! command_exists docker-compose; then
        print_warning "Docker Compose is not installed. Docker setup will be skipped."
        return 1
    fi
    
    print_success "Docker and Docker Compose are installed"
    return 0
}

# Function to setup Python virtual environment
setup_python_venv() {
    print_status "Setting up Python virtual environment..."
    
    cd apps/api
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Created Python virtual environment"
    else
        print_status "Python virtual environment already exists"
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    print_success "Python dependencies installed"
    cd ../..
}

# Function to setup Node.js dependencies
setup_node_deps() {
    print_status "Installing Node.js dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install workspace dependencies
    npm run build --if-present
    
    print_success "Node.js dependencies installed"
}

# Function to generate environment files
generate_env_files() {
    print_status "Setting up environment configuration..."
    
    # Frontend .env
    if [ ! -f "apps/web/.env" ]; then
        cp apps/web/.env.example apps/web/.env
        print_success "Created apps/web/.env from template"
        print_warning "Please edit apps/web/.env with your actual Google OAuth credentials"
    else
        print_status "apps/web/.env already exists"
    fi
    
    # Backend .env
    if [ ! -f "apps/api/.env" ]; then
        cp apps/api/.env.example apps/api/.env
        print_success "Created apps/api/.env from template"
        print_warning "Please edit apps/api/.env with your actual Google OAuth and Gemini API credentials"
    else
        print_status "apps/api/.env already exists"
    fi
}

# Function to fix build scripts
fix_build_scripts() {
    print_status "Fixing build scripts..."
    
    # Create a cross-platform build script
    cat > build-fixed.sh << 'EOF'
#!/bin/bash

# Cross-platform build script
echo "Building all packages..."

# Get the Node.js executable path dynamically
NODE_CMD=$(which node)
NPM_CMD=$(which npm)

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
EOF

    chmod +x build-fixed.sh
    print_success "Created cross-platform build script: build-fixed.sh"
}

# Function to run initial build
run_initial_build() {
    print_status "Running initial build..."
    
    # Use the fixed build script
    if [ -f "build-fixed.sh" ]; then
        ./build-fixed.sh
    else
        npm run build
    fi
    
    print_success "Initial build completed"
}

# Function to setup Docker (optional)
setup_docker() {
    if check_docker; then
        print_status "Setting up Docker containers..."
        
        # Build and start containers
        docker-compose up --build -d
        
        print_success "Docker containers started"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend: http://localhost:8000"
        print_status "API Docs: http://localhost:8000/docs"
    fi
}

# Main installation process
main() {
    print_status "Starting Tenex Full-Stack Monorepo Installation..."
    print_status "This will set up the development environment automatically."
    echo ""
    
    # Check OS
    OS_TYPE=$(get_os)
    print_status "Detected OS: $OS_TYPE"
    
    # Validate environment
    print_status "Validating environment..."
    validate_node_version
    validate_python_version
    
    # Setup dependencies
    setup_node_deps
    setup_python_venv
    
    # Generate environment files
    generate_env_files
    
    # Fix build scripts
    fix_build_scripts
    
    # Run initial build
    run_initial_build
    
    # Setup Docker (optional)
    read -p "Do you want to set up Docker containers? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_docker
    fi
    
    # Installation complete
    echo ""
    print_success "Installation completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Edit environment files with your credentials:"
    echo "   - apps/web/.env (Google OAuth Client ID)"
    echo "   - apps/api/.env (Google OAuth credentials + Gemini API key)"
    echo ""
    print_status "Development commands:"
    echo "  npm run dev          - Start all development servers"
    echo "  npm run build        - Build all packages"
    echo "  npm run test         - Run tests"
    echo "  ./build-fixed.sh     - Cross-platform build"
    echo ""
    
    if check_docker; then
        print_status "Docker commands:"
        echo "  docker-compose up        - Start development environment"
        echo "  docker-compose down      - Stop development environment"
        echo "  docker-compose logs -f   - View logs"
    fi
}

# Run main function
main "$@"
#!/bin/bash

# DocFlow Build Script
set -e

echo "🚀 Starting DocFlow build process..."

# Colors for output
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose found"

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Build the Docker images
print_status "Building Docker images..."

# Build backend
print_status "Building backend (NestJS API)..."
if docker build -t docflow-backend ./backend; then
    print_success "Backend image built successfully"
else
    print_error "Failed to build backend image"
    exit 1
fi

# Build frontend
print_status "Building frontend (Next.js)..."
if docker build -t docflow-frontend ./client; then
    print_success "Frontend image built successfully"
else
    print_error "Failed to build frontend image"
    exit 1
fi

# Build with docker-compose
print_status "Building with Docker Compose..."
if docker-compose build; then
    print_success "Docker Compose build completed"
else
    print_error "Docker Compose build failed"
    exit 1
fi

print_success "🎉 DocFlow build completed successfully!"
print_status "You can now start the application with: docker-compose up"
print_status "Or start in detached mode with: docker-compose up -d"
print_status ""
print_status "Access the application at:"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:3001"
print_status "API Documentation: http://localhost:3001/api/docs"
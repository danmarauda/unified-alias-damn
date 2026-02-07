#!/bin/bash

# Convex Panel Installation Script
# This script automatically installs and configures convex-panel for any Convex project

set -e

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

# Function to detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        if grep -q '"next"' package.json; then
            echo "nextjs"
        elif grep -q '"react"' package.json; then
            echo "react"
        elif grep -q '"vite"' package.json; then
            echo "vite"
        else
            echo "unknown"
        fi
    else
        echo "unknown"
    fi
}

# Function to check if Convex is already configured
check_convex_config() {
    if [ -f "convex.json" ] || [ -d "convex/" ]; then
        return 0
    fi
    return 1
}

# Function to get Convex URL from environment or config
get_convex_url() {
    if [ -n "$CONVEX_URL" ]; then
        echo "$CONVEX_URL"
    elif [ -f ".env.local" ]; then
        grep "NEXT_PUBLIC_CONVEX_URL" .env.local 2>/dev/null | cut -d'=' -f2
    elif [ -f ".env" ]; then
        grep "NEXT_PUBLIC_CONVEX_URL" .env 2>/dev/null | cut -d'=' -f2
    else
        echo ""
    fi
}

# Function to get Convex deployment URL
get_convex_deployment() {
    local convex_url=$(get_convex_url)
    if [ -n "$convex_url" ]; then
        echo "$convex_url"
    else
        echo ""
    fi
}

# Function to install convex-panel package
install_convex_panel() {
    local project_type=$1
    print_status "Detecting project type: $project_type"
    
    case $project_type in
        "nextjs")
            print_status "Installing convex-panel for Next.js project..."
            pnpm add -D convex-panel
            ;;

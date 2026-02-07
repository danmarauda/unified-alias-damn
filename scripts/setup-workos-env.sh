#!/bin/bash
# WorkOS Environment Setup Script
# This script helps you set up WorkOS credentials in .env.local

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   WorkOS Environment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your credentials from: https://dashboard.workos.com"
echo ""
echo "Location:"
echo "  • Client ID: Dashboard → Configuration"
echo "  • API Key: Dashboard → API Keys"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Aborted. Keeping existing .env.local"
        exit 0
    fi
    # Backup existing .env.local
    cp .env.local .env.local.backup
    echo "✅ Backed up to .env.local.backup"
    echo ""
fi

# Read existing Convex values if available
EXISTING_CONVEX_URL=""
EXISTING_CONVEX_DEPLOYMENT=""
if [ -f .env.local ]; then
    EXISTING_CONVEX_URL=$(grep "NEXT_PUBLIC_CONVEX_URL=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    EXISTING_CONVEX_DEPLOYMENT=$(grep "CONVEX_DEPLOYMENT=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
fi

# Prompt for WorkOS credentials
echo "Enter your WorkOS credentials:"
echo ""
read -p "WORKOS_API_KEY (sk_test_...): " WORKOS_API_KEY
read -p "WORKOS_CLIENT_ID (client_...): " WORKOS_CLIENT_ID

# Validate API Key format
if [[ ! $WORKOS_API_KEY =~ ^sk_(test|prod)_ ]]; then
    echo "❌ Error: API Key should start with 'sk_test_' or 'sk_prod_'"
    exit 1
fi

# Validate Client ID format
if [[ ! $WORKOS_CLIENT_ID =~ ^client_ ]]; then
    echo "❌ Error: Client ID should start with 'client_'"
    exit 1
fi

echo ""
echo "Generating secure cookie password..."
WORKOS_COOKIE_PASSWORD=$(openssl rand -base64 32)
echo "✅ Generated 32+ character password"

echo ""
read -p "Enter app URL (default: http://localhost:3000): " APP_URL
APP_URL=${APP_URL:-http://localhost:3000}

# Create .env.local
cat > .env.local << EOL
# ==============================================================================
# WORKOS AUTHENTICATION
# ==============================================================================
# Generated: $(date)

# Required: Your WorkOS API key (from Dashboard → API Keys)
WORKOS_API_KEY='${WORKOS_API_KEY}'

# Required: Your WorkOS Client ID (from Dashboard → Configuration)
WORKOS_CLIENT_ID='${WORKOS_CLIENT_ID}'

# Required: Secret for encrypting session cookies (auto-generated)
WORKOS_COOKIE_PASSWORD='${WORKOS_COOKIE_PASSWORD}'

# Required: OAuth redirect URI for callbacks
NEXT_PUBLIC_WORKOS_REDIRECT_URI='${APP_URL}/callback'

# ==============================================================================
# APPLICATION SETTINGS
# ==============================================================================
NEXT_PUBLIC_APP_URL='${APP_URL}'

# ==============================================================================
# CONVEX DATABASE
# ==============================================================================
EOL

# Add Convex values if they exist
if [ -n "$EXISTING_CONVEX_URL" ]; then
    echo "NEXT_PUBLIC_CONVEX_URL='${EXISTING_CONVEX_URL}'" >> .env.local
else
    echo "NEXT_PUBLIC_CONVEX_URL=" >> .env.local
fi

if [ -n "$EXISTING_CONVEX_DEPLOYMENT" ]; then
    echo "CONVEX_DEPLOYMENT='${EXISTING_CONVEX_DEPLOYMENT}'" >> .env.local
else
    echo "CONVEX_DEPLOYMENT=" >> .env.local
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   ✅ .env.local created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Configure WorkOS Dashboard (https://dashboard.workos.com):"
echo "    • Redirect URI: ${APP_URL}/callback"
echo "    • Initiate Login URL: ${APP_URL}/login"
echo "    • Logout Redirect: ${APP_URL}"
echo ""
echo "2️⃣  If Convex is not configured, run:"
echo "    pnpm exec convex dev"
echo ""
echo "3️⃣  Start development server:"
echo "    pnpm run dev"
echo ""
echo "4️⃣  Test authentication:"
echo "    • Navigate to: ${APP_URL}/login"
echo "    • Sign up with email/password"
echo "    • Verify session persists across refreshes"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation: See docs/WORKOS_QUICKSTART.md"
echo "🔧 Validation: Run scripts/validate-workos-credentials.sh"
echo ""

#!/bin/bash
# WorkOS Credentials Validation Script

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   WorkOS Credentials Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo ""
    echo "Run: ./scripts/setup-workos-env.sh"
    exit 1
fi

# Source .env.local
set -a
source .env.local
set +a

ERRORS=0

# Validate WORKOS_API_KEY
echo "🔍 Validating WORKOS_API_KEY..."
if [ -z "$WORKOS_API_KEY" ]; then
    echo "   ❌ WORKOS_API_KEY is not set"
    ((ERRORS++))
elif [[ $WORKOS_API_KEY =~ ^sk_(test|prod)_ ]]; then
    if [[ $WORKOS_API_KEY =~ ^sk_test_ ]]; then
        echo "   ✅ Valid staging API key (sk_test_...)"
    else
        echo "   ✅ Valid production API key (sk_prod_...)"
    fi
else
    echo "   ❌ Invalid format (should start with sk_test_ or sk_prod_)"
    ((ERRORS++))
fi

# Validate WORKOS_CLIENT_ID
echo "🔍 Validating WORKOS_CLIENT_ID..."
if [ -z "$WORKOS_CLIENT_ID" ]; then
    echo "   ❌ WORKOS_CLIENT_ID is not set"
    ((ERRORS++))
elif [[ $WORKOS_CLIENT_ID =~ ^client_ ]]; then
    echo "   ✅ Valid client ID format"
else
    echo "   ❌ Invalid format (should start with client_)"
    ((ERRORS++))
fi

# Validate WORKOS_COOKIE_PASSWORD
echo "🔍 Validating WORKOS_COOKIE_PASSWORD..."
if [ -z "$WORKOS_COOKIE_PASSWORD" ]; then
    echo "   ❌ WORKOS_COOKIE_PASSWORD is not set"
    ((ERRORS++))
elif [ ${#WORKOS_COOKIE_PASSWORD} -ge 32 ]; then
    echo "   ✅ Cookie password is secure (${#WORKOS_COOKIE_PASSWORD} characters)"
else
    echo "   ❌ Cookie password is too short (${#WORKOS_COOKIE_PASSWORD} chars, needs 32+)"
    ((ERRORS++))
fi

# Validate NEXT_PUBLIC_WORKOS_REDIRECT_URI
echo "🔍 Validating NEXT_PUBLIC_WORKOS_REDIRECT_URI..."
if [ -z "$NEXT_PUBLIC_WORKOS_REDIRECT_URI" ]; then
    echo "   ❌ NEXT_PUBLIC_WORKOS_REDIRECT_URI is not set"
    ((ERRORS++))
elif [[ $NEXT_PUBLIC_WORKOS_REDIRECT_URI =~ /callback$ ]]; then
    echo "   ✅ Valid redirect URI: $NEXT_PUBLIC_WORKOS_REDIRECT_URI"
else
    echo "   ⚠️  Redirect URI should end with /callback"
    echo "      Current: $NEXT_PUBLIC_WORKOS_REDIRECT_URI"
fi

# Validate NEXT_PUBLIC_APP_URL
echo "🔍 Validating NEXT_PUBLIC_APP_URL..."
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    echo "   ❌ NEXT_PUBLIC_APP_URL is not set"
    ((ERRORS++))
else
    echo "   ✅ App URL: $NEXT_PUBLIC_APP_URL"
fi

# Check Convex configuration
echo "🔍 Checking Convex configuration..."
if [ -z "$NEXT_PUBLIC_CONVEX_URL" ] || [ -z "$CONVEX_DEPLOYMENT" ]; then
    echo "   ⚠️  Convex not fully configured"
    echo "      Run: pnpm exec convex dev"
else
    echo "   ✅ Convex configured"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo "   ✅ All credentials are valid!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Configure these URLs in WorkOS Dashboard:"
    echo ""
    echo "   Redirect URI:        $NEXT_PUBLIC_WORKOS_REDIRECT_URI"
    echo "   Initiate Login URL:  ${NEXT_PUBLIC_APP_URL}/login"
    echo "   Logout Redirect:     $NEXT_PUBLIC_APP_URL"
    echo ""
    echo "🚀 Ready to start: pnpm run dev"
else
    echo "   ❌ Found $ERRORS error(s)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Run: ./scripts/setup-workos-env.sh"
    exit 1
fi

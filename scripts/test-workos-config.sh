#!/bin/bash

# WorkOS Configuration Validation Script
# Tests environment variables and configuration for WorkOS AuthKit migration

set -e

echo "🔍 WorkOS Configuration Validation"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0

# Function to check if variable is set
check_required() {
    local var_name=$1
    local var_value="${!var_name}"

    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name is not set"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name is set"
        return 0
    fi
}

# Function to check variable format
check_format() {
    local var_name=$1
    local var_value="${!var_name}"
    local pattern=$2
    local description=$3

    if [[ ! $var_value =~ $pattern ]]; then
        echo -e "${RED}✗${NC} $var_name has invalid format: $description"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name format is valid"
        return 0
    fi
}

# Function to check variable length
check_length() {
    local var_name=$1
    local var_value="${!var_name}"
    local min_length=$2

    if [ ${#var_value} -lt $min_length ]; then
        echo -e "${RED}✗${NC} $var_name is too short (${#var_value} chars, minimum $min_length)"
        ((ERRORS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} $var_name length is sufficient (${#var_value} chars)"
        return 0
    fi
}

# Function to show warning
warn() {
    local message=$1
    echo -e "${YELLOW}⚠${NC} $message"
    ((WARNINGS++))
}

# Load environment variables from .env.local if it exists
if [ -f ".env.local" ]; then
    echo "📄 Loading environment from .env.local"
    export $(grep -v '^#' .env.local | xargs)
    echo ""
else
    echo -e "${YELLOW}⚠${NC} .env.local not found, checking system environment"
    echo ""
fi

# 1. Check WorkOS Required Variables
echo "1️⃣  Checking WorkOS Required Variables"
echo "--------------------------------------"

check_required "WORKOS_API_KEY"
if [ $? -eq 0 ]; then
    check_format "WORKOS_API_KEY" "^sk_(test|live)_" "Must start with sk_test_ or sk_live_"
fi

check_required "WORKOS_CLIENT_ID"
if [ $? -eq 0 ]; then
    check_format "WORKOS_CLIENT_ID" "^client_" "Must start with client_"
fi

check_required "WORKOS_COOKIE_PASSWORD"
if [ $? -eq 0 ]; then
    check_length "WORKOS_COOKIE_PASSWORD" 32
fi

check_required "WORKOS_REDIRECT_URI"
if [ $? -eq 0 ]; then
    check_format "WORKOS_REDIRECT_URI" "^https?://.*/(callback|auth/callback)" "Must be valid URL ending with /callback or /auth/callback"

    # Check for trailing slash
    if [[ $WORKOS_REDIRECT_URI =~ /$ ]]; then
        warn "WORKOS_REDIRECT_URI has trailing slash, this may cause issues"
    fi

    # Check for localhost in production
    if [[ $WORKOS_API_KEY =~ ^sk_live_ ]] && [[ $WORKOS_REDIRECT_URI =~ localhost ]]; then
        warn "Using localhost URL with production API key (sk_live_)"
    fi
fi

echo ""

# 2. Check Convex Configuration
echo "2️⃣  Checking Convex Configuration"
echo "----------------------------------"

check_required "NEXT_PUBLIC_CONVEX_URL"
if [ $? -eq 0 ]; then
    check_format "NEXT_PUBLIC_CONVEX_URL" "^https://.*\.convex\.(cloud|site)" "Must be valid Convex URL"
fi

check_required "CONVEX_DEPLOYMENT"

echo ""

# 3. Check Application Configuration
echo "3️⃣  Checking Application Configuration"
echo "---------------------------------------"

check_required "NEXT_PUBLIC_APP_URL"
if [ $? -eq 0 ]; then
    check_format "NEXT_PUBLIC_APP_URL" "^https?://" "Must be valid URL"

    # Ensure consistency between APP_URL and REDIRECT_URI domain
    if [ ! -z "$WORKOS_REDIRECT_URI" ]; then
        APP_DOMAIN=$(echo "$NEXT_PUBLIC_APP_URL" | sed -E 's|^https?://([^/]+).*|\1|')
        REDIRECT_DOMAIN=$(echo "$WORKOS_REDIRECT_URI" | sed -E 's|^https?://([^/]+).*|\1|')

        if [ "$APP_DOMAIN" != "$REDIRECT_DOMAIN" ]; then
            warn "Domain mismatch: APP_URL ($APP_DOMAIN) vs REDIRECT_URI ($REDIRECT_DOMAIN)"
        else
            echo -e "${GREEN}✓${NC} Domain consistency verified"
        fi
    fi
fi

echo ""

# 4. Test Convex Connection
echo "4️⃣  Testing Convex Connection"
echo "-----------------------------"

if command -v npx &> /dev/null; then
    if npx convex dev --once --run="async (ctx) => 'Connection successful'" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Convex connection successful"
    else
        echo -e "${RED}✗${NC} Convex connection failed"
        warn "Ensure Convex dev server is running: npm run dev:convex"
        ((ERRORS++))
    fi
else
    warn "npx not found, skipping Convex connection test"
fi

echo ""

# 5. Check File Permissions
echo "5️⃣  Checking File Permissions"
echo "-----------------------------"

if [ -f ".env.local" ]; then
    PERMS=$(stat -f "%A" .env.local 2>/dev/null || stat -c "%a" .env.local 2>/dev/null)

    if [ "$PERMS" != "600" ] && [ "$PERMS" != "400" ]; then
        warn ".env.local permissions are $PERMS, consider restricting to 600"
        echo "  Run: chmod 600 .env.local"
    else
        echo -e "${GREEN}✓${NC} .env.local permissions are secure ($PERMS)"
    fi
else
    warn ".env.local not found"
fi

echo ""

# 6. Generate Sample Configuration
echo "6️⃣  Configuration Helpers"
echo "-------------------------"

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "📝 Sample .env.local configuration:"
    echo ""
    cat << 'EOF'
# WorkOS Configuration
WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here
WORKOS_COOKIE_PASSWORD=<generate with command below>
WORKOS_REDIRECT_URI=http://localhost:3000/callback

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo ""
    echo "🔐 Generate WORKOS_COOKIE_PASSWORD:"
    echo "node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    echo ""
fi

# 7. Summary
echo ""
echo "📊 Validation Summary"
echo "===================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run migration validation: ./scripts/validate-migration.sh"
    echo "  2. Start development servers: npm run dev"
    echo "  3. Test authentication flows"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Configuration valid with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Review warnings above before proceeding"
    exit 0
else
    echo -e "${RED}❌ Configuration invalid: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Fix errors above before proceeding"
    exit 1
fi

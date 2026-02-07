#!/bin/bash

# WorkOS Migration Validation Script
# Validates file changes, imports, and build integrity for WorkOS migration

set -e

echo "🔍 WorkOS Migration Validation"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0
CHECKS_PASSED=0

# Function to check if file exists
check_file_exists() {
    local file=$1
    local description=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description missing: $file"
        ((ERRORS++))
        return 1
    fi
}

# Function to check if file does NOT exist (should be deleted)
check_file_deleted() {
    local file=$1
    local description=$2

    if [ ! -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description removed: $file"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $description still exists: $file (should be removed)"
        ((WARNINGS++))
        return 1
    fi
}

# Function to check file content
check_file_contains() {
    local file=$1
    local pattern=$2
    local description=$3

    if [ ! -f "$file" ]; then
        echo -e "${RED}✗${NC} File not found: $file"
        ((ERRORS++))
        return 1
    fi

    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description found in $file"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $description not found in $file"
        ((ERRORS++))
        return 1
    fi
}

# Function to check file does NOT contain pattern
check_file_not_contains() {
    local file=$1
    local pattern=$2
    local description=$3

    if [ ! -f "$file" ]; then
        # File doesn't exist, so pattern can't exist either
        return 0
    fi

    if ! grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description not found in $file (correct)"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $description still exists in $file (should be removed)"
        ((WARNINGS++))
        return 1
    fi
}

# Function to show warning
warn() {
    local message=$1
    echo -e "${YELLOW}⚠${NC} $message"
    ((WARNINGS++))
}

# Function to show info
info() {
    local message=$1
    echo -e "${BLUE}ℹ${NC} $message"
}

# 1. Check New Files Added
echo "1️⃣  Checking New Files"
echo "----------------------"

check_file_exists "src/lib/workos-auth.ts" "WorkOS auth utilities"
check_file_exists "src/middleware.ts" "Next.js middleware"
check_file_exists "src/app/callback/route.ts" "Callback route"
check_file_exists "src/app/login/page.tsx" "Login page"
check_file_exists "convex/users.ts" "Convex users functions"
check_file_exists "docs/MIGRATION_GUIDE.md" "Migration guide"
check_file_exists "docs/MIGRATION_TEST_PLAN.md" "Test plan"

echo ""

# 2. Check Old Files Removed
echo "2️⃣  Checking Old Files Removed"
echo "-------------------------------"

check_file_deleted "src/lib/auth.ts" "Better Auth config"
check_file_deleted "src/lib/auth-client.ts" "Better Auth client"
check_file_deleted "convex/http.ts" "Old HTTP routes"

echo ""

# 3. Check Import Updates
echo "3️⃣  Checking Import Updates"
echo "---------------------------"

# Check that old auth imports are removed
check_file_not_contains "src/app/providers.tsx" "from \"@/lib/auth-client\"" "Better Auth imports"
check_file_not_contains "src/components/layout/Header.tsx" "from \"@/lib/auth-client\"" "Better Auth imports"

# Check that WorkOS imports are present
if [ -f "src/components/layout/Header.tsx" ]; then
    check_file_contains "src/components/layout/Header.tsx" "from \"@/lib/workos-auth\"" "WorkOS auth imports"
fi

echo ""

# 4. Check Package Dependencies
echo "4️⃣  Checking Package Dependencies"
echo "----------------------------------"

if [ -f "package.json" ]; then
    check_file_contains "package.json" "\"@workos-inc/authkit-nextjs\"" "WorkOS AuthKit package"
    check_file_not_contains "package.json" "\"better-auth\"" "Better Auth package"

    # Check if pnpm-lock.yaml is up to date
    if [ -f "pnpm-lock.yaml" ]; then
        info "Lock file: pnpm-lock.yaml found"
        if ! grep -q "@workos-inc/authkit-nextjs" "package.json"; then
            warn "WorkOS package not in package.json but lockfile exists"
        fi
    else
        warn "No lock file found. Run 'pnpm install' to generate pnpm-lock.yaml"
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    ((ERRORS++))
fi

echo ""

# 5. Check TypeScript Configuration
echo "5️⃣  Checking TypeScript Configuration"
echo "--------------------------------------"

if [ -f "tsconfig.json" ]; then
    check_file_contains "tsconfig.json" "\"strict\": true" "Strict mode enabled"
    echo -e "${GREEN}✓${NC} tsconfig.json found"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} tsconfig.json not found"
    ((ERRORS++))
fi

echo ""

# 6. Run TypeScript Type Checking
echo "6️⃣  Running TypeScript Type Check"
echo "----------------------------------"

if command -v pnpm &> /dev/null; then
    info "Running: pnpm exec tsc --noEmit"

    if pnpm exec tsc --noEmit 2>&1 | tee /tmp/tsc-output.log; then
        echo -e "${GREEN}✓${NC} TypeScript compilation successful"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} TypeScript compilation failed"
        echo ""
        echo "Errors:"
        cat /tmp/tsc-output.log
        ((ERRORS++))
    fi
else
    warn "pnpm not found, skipping TypeScript check"
fi

echo ""

# 7. Check Convex Schema
echo "7️⃣  Checking Convex Schema"
echo "--------------------------"

if [ -f "convex/schema.ts" ]; then
    check_file_contains "convex/schema.ts" "users:" "Users table definition"
    check_file_contains "convex/schema.ts" "userId:" "User ID field"
    check_file_contains "convex/schema.ts" "email:" "Email field"

    echo -e "${GREEN}✓${NC} Convex schema validated"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} convex/schema.ts not found"
    ((ERRORS++))
fi

echo ""

# 8. Check Environment Variables Template
echo "8️⃣  Checking Environment Setup"
echo "-------------------------------"

if [ -f ".env.example" ] || [ -f ".env.local.example" ]; then
    EXAMPLE_FILE=$([ -f ".env.example" ] && echo ".env.example" || echo ".env.local.example")

    check_file_contains "$EXAMPLE_FILE" "WORKOS_API_KEY" "WorkOS API key placeholder"
    check_file_contains "$EXAMPLE_FILE" "WORKOS_CLIENT_ID" "WorkOS client ID placeholder"
    check_file_contains "$EXAMPLE_FILE" "WORKOS_COOKIE_PASSWORD" "WorkOS cookie password placeholder"
    check_file_contains "$EXAMPLE_FILE" "WORKOS_REDIRECT_URI" "WorkOS redirect URI placeholder"
else
    warn "No .env.example file found. Consider creating one for documentation"
fi

if [ -f ".env.local" ]; then
    info ".env.local exists (check with test-workos-config.sh)"
else
    warn ".env.local not found. Create from .env.example and run test-workos-config.sh"
fi

echo ""

# 9. Check Next.js Configuration
echo "9️⃣  Checking Next.js Configuration"
echo "-----------------------------------"

if [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
    CONFIG_FILE=$([ -f "next.config.mjs" ] && echo "next.config.mjs" || echo "next.config.js")
    echo -e "${GREEN}✓${NC} Next.js config found: $CONFIG_FILE"
    ((CHECKS_PASSED++))

    # Check for server components config if needed
    if grep -q "experimental" "$CONFIG_FILE"; then
        info "Experimental features configured"
    fi
else
    warn "Next.js config not found"
fi

echo ""

# 10. Verify Build (Optional)
echo "🔟 Build Verification (Optional)"
echo "--------------------------------"

read -p "Run full build? This will take time (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Running: npm run build"

    if npm run build 2>&1 | tee /tmp/build-output.log; then
        echo -e "${GREEN}✓${NC} Build successful"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} Build failed"
        echo ""
        echo "Errors:"
        tail -n 50 /tmp/build-output.log
        ((ERRORS++))
    fi
else
    info "Skipping build verification (run 'npm run build' manually)"
fi

echo ""

# 11. Check Documentation
echo "1️⃣1️⃣  Checking Documentation"
echo "----------------------------"

if [ -f "docs/MIGRATION_GUIDE.md" ]; then
    check_file_contains "docs/MIGRATION_GUIDE.md" "## Overview" "Migration guide structure"
    check_file_contains "docs/MIGRATION_GUIDE.md" "## Prerequisites" "Prerequisites section"
    check_file_contains "docs/MIGRATION_GUIDE.md" "## Step-by-Step" "Step-by-step instructions"
fi

if [ -f "docs/MIGRATION_TEST_PLAN.md" ]; then
    check_file_contains "docs/MIGRATION_TEST_PLAN.md" "## Test Scenarios" "Test scenarios section"
    check_file_contains "docs/MIGRATION_TEST_PLAN.md" "## Edge Cases" "Edge cases section"
fi

if [ -f "README.md" ]; then
    info "README.md exists"
    if ! grep -q "WorkOS" "README.md"; then
        warn "README.md doesn't mention WorkOS (consider updating)"
    fi
fi

echo ""

# 12. Summary
echo "📊 Validation Summary"
echo "===================="
echo ""

TOTAL_CHECKS=$((CHECKS_PASSED + ERRORS + WARNINGS))

echo -e "Total checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Errors: $ERRORS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Migration validation passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run environment validation: ./scripts/test-workos-config.sh"
    echo "  2. Review migration guide: docs/MIGRATION_GUIDE.md"
    echo "  3. Review test plan: docs/MIGRATION_TEST_PLAN.md"
    echo "  4. Start development: npm run dev"
    echo "  5. Test authentication flows manually"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Migration validation passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Review warnings above before proceeding"
    echo ""
    echo "Next steps:"
    echo "  1. Address warnings if needed"
    echo "  2. Run environment validation: ./scripts/test-workos-config.sh"
    echo "  3. Review migration guide: docs/MIGRATION_GUIDE.md"
    exit 0
else
    echo -e "${RED}❌ Migration validation failed: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Fix errors above before proceeding"
    echo ""
    echo "Common issues:"
    echo "  - Missing files: Review docs/MIGRATION_GUIDE.md for required files"
    echo "  - Import errors: Check that old imports are updated to WorkOS"
    echo "  - TypeScript errors: Fix type issues reported above"
    echo "  - Missing dependencies: Run 'bun install' to update packages"
    exit 1
fi

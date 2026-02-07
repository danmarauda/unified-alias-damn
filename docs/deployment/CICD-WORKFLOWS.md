# CI/CD Workflows

Complete GitHub Actions workflow configurations for the ALIAS Enterprise Platform.

## Overview

The CI/CD pipeline consists of 4 main workflows that provide automated quality checks, preview deployments, staging deployments, and production deployments with security scanning.

## Workflow Architecture

```
Pull Request Created
├── check.yml (Quality Gates)
│   ├── Lint with Biome
│   ├── Type check with TypeScript
│   ├── Run test suite
│   └── Build all apps
│
├── preview.yml (Preview Deployment)
│   ├── Run quality checks
│   ├── Deploy to Vercel Preview
│   ├── Deploy to Convex Preview
│   └── Comment PR with URLs
│
Branch: staging
├── staging.yml (Staging Deployment)
│   ├── Run quality checks
│   ├── Deploy to Vercel Staging
│   └── Deploy to Convex Staging
│
Branch: main
└── production.yml (Production Deployment)
    ├── Run quality checks
    ├── Security scan
    ├── Deploy to Vercel Production
    ├── Deploy to Convex Production
    ├── Build mobile apps (EAS)
    └── Notify team
```

## Required GitHub Secrets

Configure these in: `Settings > Secrets and variables > Actions`

### Vercel Secrets
```bash
VERCEL_TOKEN                 # Vercel API token
VERCEL_ORG_ID               # Organization ID
VERCEL_PROJECT_ID_ADMIN     # Super Admin project ID
VERCEL_PROJECT_ID_CLIENT    # Client Workspace project ID
VERCEL_PROJECT_ID_MARKETING # Marketing site project ID
VERCEL_PROJECT_ID_DOCS      # Docs site project ID
VERCEL_PROJECT_ID_API       # API project ID
```

### Convex Secrets
```bash
CONVEX_DEPLOY_KEY           # Convex deployment key
```

### Mobile (EAS) Secrets
```bash
EXPO_TOKEN                  # Expo access token
EAS_BUILD_NPM_CACHE         # Enable npm caching (true/false)
APPLE_TEAM_ID              # Apple Developer Team ID
```

### Notification Secrets
```bash
SLACK_WEBHOOK_URL          # Slack notifications (optional)
```

## Workflow Files

### 1. Quality Check Workflow

**File:** `.github/workflows/check.yml`

```yaml
name: Quality Check

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.3.0

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Type check
        run: bun run typecheck

      - name: Run tests
        run: bun run test

      - name: Build all apps
        run: bun run build
        env:
          SKIP_ENV_VALIDATION: true
```

### 2. Preview Deployment Workflow

**File:** `.github/workflows/preview.yml`

```yaml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main, staging]

concurrency:
  group: preview-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.3.0

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run quality checks
        run: |
          bun run lint
          bun run typecheck
          bun run test

      - name: Deploy Convex (Preview)
        run: bunx convex deploy --cmd 'bun run build:convex' --preview-create
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}

      - name: Deploy to Vercel (Super Admin)
        id: deploy-admin
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_ADMIN }}
          working-directory: ./apps/super-admin
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (Client Workspace)
        id: deploy-client
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_CLIENT }}
          working-directory: ./apps/client-workspace
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🚀 Preview Deployment Ready

              **Super Admin:** ${{ steps.deploy-admin.outputs.preview-url }}
              **Client Workspace:** ${{ steps.deploy-client.outputs.preview-url }}
              **Convex Dashboard:** https://dashboard.convex.dev

              Quality checks passed ✅`
            })
```

### 3. Staging Deployment Workflow

**File:** `.github/workflows/staging.yml`

```yaml
name: Deploy to Staging

on:
  push:
    branches: [staging]

concurrency:
  group: staging
  cancel-in-progress: false

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    timeout-minutes: 20
    environment:
      name: staging
      url: https://staging.alias.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.3.0

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run quality checks
        run: |
          bun run lint
          bun run typecheck
          bun run test

      - name: Deploy Convex (Staging)
        run: bunx convex deploy --cmd 'bun run build:convex'
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
          CONVEX_DEPLOYMENT: staging:alias-staging

      - name: Deploy to Vercel (Super Admin - Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_ADMIN }}
          vercel-args: '--prod'
          working-directory: ./apps/super-admin
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (Client Workspace - Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_CLIENT }}
          vercel-args: '--prod'
          working-directory: ./apps/client-workspace
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (Marketing - Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_MARKETING }}
          vercel-args: '--prod'
          working-directory: ./apps/marketing
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (Docs - Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DOCS }}
          vercel-args: '--prod'
          working-directory: ./apps/docs
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to Vercel (API - Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_API }}
          vercel-args: '--prod'
          working-directory: ./apps/api
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: 'Staging deployment ${{ job.status }}'
```

### 4. Production Deployment Workflow

**File:** `.github/workflows/production.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

concurrency:
  group: production
  cancel-in-progress: false

jobs:
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-production:
    name: Deploy to Production
    needs: security-scan
    runs-on: ubuntu-latest
    timeout-minutes: 30
    environment:
      name: production
      url: https://alias.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: 1.3.0

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run quality checks
        run: |
          bun run lint
          bun run typecheck
          bun run test

      - name: Build all packages
        run: bun run build

      - name: Deploy Convex (Production)
        run: bunx convex deploy --cmd 'bun run build:convex'
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
          CONVEX_DEPLOYMENT: prod:alias-production

      - name: Deploy to Vercel (All Apps - Production)
        run: |
          for app in super-admin client-workspace marketing docs api; do
            cd apps/$app
            vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
            cd ../..
          done

      - name: Build iOS App (EAS)
        working-directory: ./apps/mobile
        run: eas build --platform ios --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Build Android App (EAS)
        working-directory: ./apps/mobile
        run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Submit iOS to App Store
        working-directory: ./apps/mobile
        run: eas submit --platform ios --latest
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Submit Android to Play Store
        working-directory: ./apps/mobile
        run: eas submit --platform android --latest
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: |
            Production deployment ${{ job.status }}
            Web: https://alias.com
            Mobile: Apps submitted to stores
```

## Mobile-Specific Workflows

### EAS Update Workflow (OTA Updates)

**File:** `.github/workflows/eas-update.yml`

```yaml
name: EAS Update (OTA)

on:
  push:
    branches: [main, staging]
    paths:
      - 'apps/mobile/**'

jobs:
  update:
    name: Publish EAS Update
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        working-directory: ./apps/mobile
        run: npm install

      - name: Determine channel
        id: channel
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "channel=production" >> $GITHUB_OUTPUT
          else
            echo "channel=internal" >> $GITHUB_OUTPUT
          fi

      - name: Publish update
        working-directory: ./apps/mobile
        run: eas update --channel ${{ steps.channel.outputs.channel }} --non-interactive --message "${{ github.event.head_commit.message }}"
```

## Setup Instructions

### 1. Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### 2. Add Workflow Files

Copy all workflow files from this documentation to `.github/workflows/`

### 3. Configure GitHub Secrets

```bash
# Navigate to: Settings > Secrets and variables > Actions > New repository secret

# Add each secret listed in "Required GitHub Secrets" section
```

### 4. Configure Vercel Projects

For each Vercel project, run:

```bash
cd apps/{app-name}
vercel link
# Follow prompts to link to existing project
```

Then get project IDs:

```bash
cat .vercel/project.json | jq -r '.projectId'
# Add to GitHub secrets as VERCEL_PROJECT_ID_{APP_NAME}
```

### 5. Configure EAS

```bash
cd apps/mobile
eas login
eas build:configure
```

Get Expo token:

```bash
expo whoami
# Settings > Access Tokens > Create Token
# Add to GitHub secrets as EXPO_TOKEN
```

### 6. Test Workflows

Create a test PR to trigger:
- `check.yml` - Quality checks
- `preview.yml` - Preview deployment

Merge to staging to trigger:
- `staging.yml` - Staging deployment

Merge to main to trigger:
- `production.yml` - Production deployment

## Monitoring Workflow Runs

### GitHub Actions UI
- Navigate to: `Actions` tab in repository
- View workflow runs, logs, and artifacts

### Vercel Dashboard
- View deployments: https://vercel.com/dashboard
- Check deployment logs and previews

### Convex Dashboard
- View deployments: https://dashboard.convex.dev
- Monitor functions and logs

### EAS Dashboard
- View builds: https://expo.dev/accounts/[account]/projects/alias-mobile/builds
- Monitor updates and submissions

## Troubleshooting

### Workflow Failed - Lint Errors

```bash
# Fix locally
bun run lint

# Commit and push fix
git add .
git commit -m "fix: resolve lint errors"
git push
```

### Deployment Failed - Environment Variables

1. Check Vercel project settings
2. Verify all required environment variables are set
3. Ensure variables are available in correct environment (Preview/Production)

### Mobile Build Failed

```bash
# Check EAS build logs
eas build:list

# View specific build
eas build:view [build-id]

# Common fixes:
# - Update provisioning profiles
# - Check credentials
# - Verify app.json configuration
```

### Convex Deployment Failed

```bash
# Check deployment key
echo $CONVEX_DEPLOY_KEY

# Test locally
bunx convex deploy --cmd 'bun run build:convex'

# Check Convex dashboard for errors
```

## Best Practices

1. **Always run quality checks locally before pushing:**
   ```bash
   bun run lint && bun run typecheck && bun run test && bun run build
   ```

2. **Use conventional commit messages:**
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   chore: maintenance task
   ```

3. **Test in preview/staging before production**
4. **Monitor deployment dashboards after merges**
5. **Keep secrets rotated regularly (quarterly)**
6. **Review security scan results before production**

## Cost Optimization

- Use workflow concurrency to cancel outdated runs
- Cache dependencies to speed up builds
- Use `turbo-ignore` to skip unchanged apps
- Set appropriate timeouts to prevent runaway jobs

## Next Steps

1. **Set up notification channels** (Slack, email)
2. **Configure branch protection rules** (require checks before merge)
3. **Add deployment approval gates** for production
4. **Set up automated rollback** on critical failures
5. **Implement feature flags** for gradual rollouts

---

**Related Documentation:**
- [Deployment Architecture](./DEPLOYMENT-ARCHITECTURE.md)
- [Environment Variables](./ENV-VARIABLES.md)
- [Security Setup](./SECURITY-SETUP.md)

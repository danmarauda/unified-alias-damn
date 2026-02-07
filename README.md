# ALIAS - AEOS: Agentic Enterprise Operating System

A modern, real-time agentic enterprise platform built with Next.js 15, Convex database, and WorkOS authentication.

## Features

- **Real-time Database**: Powered by Convex for reactive data synchronization
- **Secure Authentication**: WorkOS AuthKit with OAuth, SSO, and MFA support
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **3D Visualizations**: Interactive globe using Three.js and React Three Fiber
- **Type-Safe**: Full TypeScript support with strict mode
- **Fast Development**: Turbopack and hot module reloading

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Database**: [Convex](https://convex.dev) - Real-time database
- **Authentication**: [WorkOS AuthKit](https://workos.com/docs/authkit) - Enterprise-grade auth
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) with Radix UI primitives
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **3D Graphics**: [Three.js](https://threejs.org) with React Three Fiber
- **Package Manager**: [Bun](https://bun.sh)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0.25 or later
- [Node.js](https://nodejs.org) 18+ (for Convex CLI)
- WorkOS account ([Sign up free](https://dashboard.workos.com))
- Convex account ([Sign up free](https://dashboard.convex.dev))

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd unified-alias-damn

# Install dependencies with Bun
bun install
```

### 2. Set Up Convex

```bash
# Login to Convex
bunx convex dev

# Follow the prompts to create a new project
# Copy the CONVEX_URL and CONVEX_DEPLOYMENT to .env.local
```

### 3. Set Up WorkOS Authentication

#### A. Create WorkOS Account
1. Sign up at [dashboard.workos.com](https://dashboard.workos.com)
2. Create a new project
3. Note your **API Key** and **Client ID**

#### B. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and add your credentials:
# - WORKOS_API_KEY (from WorkOS dashboard)
# - WORKOS_CLIENT_ID (from WorkOS dashboard)
# - WORKOS_COOKIE_PASSWORD (generate with: openssl rand -base64 32)
# - NEXT_PUBLIC_CONVEX_URL (from Convex dashboard)
# - CONVEX_DEPLOYMENT (from Convex dashboard)
```

#### C. Configure WorkOS Dashboard

In your WorkOS Dashboard → Configuration:

**Redirect URIs:**
- Development: `http://localhost:3000/callback`
- Production: `https://your-domain.com/callback`

**Initiate Login URL:**
- Development: `http://localhost:3000/login`
- Production: `https://your-domain.com/login`

**Logout Redirect:**
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### 4. Run Development Server

```bash
# Start both Next.js and Convex dev servers
bun dev

# Or run them separately:
bun run dev:next    # Next.js only (with Turbopack)
bun run dev:convex  # Convex only
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication System

This application uses **WorkOS AuthKit** for authentication, providing:

- **Email/Password Authentication**: Secure password-based login
- **OAuth/SSO**: Connect with Google, GitHub, Microsoft, and more
- **Multi-Factor Authentication (MFA)**: Optional 2FA for enhanced security
- **Enterprise SSO**: SAML-based single sign-on for organizations
- **Session Management**: Secure, encrypted sessions with automatic refresh
- **User Management**: Built-in user profiles and account management

### Authentication Flow

1. **Login**: Users navigate to `/login` to initiate authentication
2. **OAuth Redirect**: WorkOS handles the OAuth flow securely
3. **Callback**: WorkOS redirects to `/callback` with auth tokens
4. **Session Creation**: Secure session cookies are created
5. **User Sync**: User data is automatically synced to Convex database
6. **Protected Routes**: Middleware protects authenticated routes

### Using Authentication in Components

```typescript
"use client";

import { useWorkOS } from "@/lib/hooks/useWorkOS";

export function MyComponent() {
  const { workosUser, convexUser, isLoading, isAuthenticated } = useWorkOS();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {workosUser.email}!</h1>
      <p>Convex User ID: {convexUser._id}</p>
    </div>
  );
}
```

### Protected Routes

Routes are automatically protected by the middleware. Public routes are defined in `middleware.ts`:

```typescript
// Public (no auth required)
- / (home page)
- /login (login page)
- /callback (OAuth callback)

// Protected (auth required)
- /agents/*
- /projects/*
- /ontology/*
- All other routes
```

### Authentication Endpoints

- `GET /login` - Initiate login flow
- `GET /callback` - OAuth callback handler
- `GET /api/auth/logout` - Sign out user

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── login/               # WorkOS login initiation
│   ├── callback/            # OAuth callback handler
│   ├── api/auth/logout/     # Logout endpoint
│   ├── agents/              # Agent management pages
│   ├── projects/            # Project lifecycle management
│   └── ontology/            # Ontology editor
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific components
│   ├── layout/              # Layout components (Header, Footer)
│   └── ontology/            # Ontology visualization
├── lib/
│   ├── hooks/
│   │   └── useWorkOS.ts     # WorkOS + Convex integration hook
│   └── utils.ts             # Utility functions
convex/
├── schema.ts                # Database schema definition
├── auth.ts                  # Auth-related queries/mutations
├── stats.ts                 # Stats queries and mutations
├── agentMetrics.ts          # Agent performance data
└── http.ts                  # HTTP routes
middleware.ts                # WorkOS AuthKit middleware
```

## Available Scripts

```bash
# Development
bun dev                      # Run both Next.js and Convex dev servers
bun run dev:next            # Start only Next.js with Turbopack
bun run dev:convex          # Start only Convex dev server

# Build & Production
bun run build               # Build Next.js and deploy Convex
bun start                   # Start production server

# Code Quality
bun run lint                # Run Biome linter and TypeScript type checking
bun run format              # Format code with Biome

# Database
bunx convex dev             # Start Convex dev server
bunx convex deploy          # Deploy Convex to production
bunx convex dashboard       # Open Convex dashboard
```

## Environment Variables

Required environment variables (see `.env.local.example` for full documentation):

```bash
# Convex Database
NEXT_PUBLIC_CONVEX_URL=         # Public Convex URL
CONVEX_DEPLOYMENT=              # Convex deployment identifier

# WorkOS Authentication
WORKOS_API_KEY=                 # WorkOS API key (starts with 'sk_')
WORKOS_CLIENT_ID=               # WorkOS Client ID (starts with 'client_')
WORKOS_COOKIE_PASSWORD=         # 32+ character secret (generate with openssl)
NEXT_PUBLIC_WORKOS_REDIRECT_URI= # OAuth redirect URI

# Application
NEXT_PUBLIC_APP_URL=            # Base URL (http://localhost:3000 for dev)
```

## Deployment

### Netlify (Recommended)

The project is pre-configured for Netlify deployment:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Import your GitHub repository
   - Netlify will auto-detect Next.js settings

3. **Configure Environment Variables**
   - Add all variables from `.env.local` to Netlify
   - Update `NEXT_PUBLIC_WORKOS_REDIRECT_URI` to production URL

4. **Update WorkOS Dashboard**
   - Add production redirect URIs
   - Update initiate login URL
   - Update logout redirect URL

5. **Deploy**
   - Netlify will automatically deploy on push
   - Convex will be deployed during the build step

### Other Platforms (Vercel, AWS, etc.)

1. Set environment variables in your platform
2. Update WorkOS redirect URIs to match your domain
3. Deploy with: `bun run build && bun start`

## Code Style & Formatting

- **Formatter**: Biome with double quotes, 2-space indentation
- **Linter**: Biome with relaxed a11y rules
- **TypeScript**: Strict mode enabled
- **Path Aliases**: `@/*` maps to `./src/*`

## Learn More

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [WorkOS Documentation](https://workos.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Project-Specific Docs
- [WorkOS Migration Guide](docs/WORKOS_MIGRATION_GUIDE.md) - Detailed migration instructions
- [WorkOS Quickstart](docs/WORKOS_QUICKSTART.md) - Quick setup guide
- [WorkOS Comparison](docs/WORKOS_COMPARISON.md) - Better Auth vs WorkOS comparison

## Troubleshooting

### Common Issues

**"Invalid redirect URI" error**
- Ensure redirect URIs in WorkOS Dashboard exactly match your `.env.local`
- Include protocol (`http://` or `https://`)
- No trailing slashes

**Sessions not persisting**
- Verify `WORKOS_COOKIE_PASSWORD` is at least 32 characters
- Check browser cookie settings (allow third-party cookies)

**User not syncing to Convex**
- Check Convex logs in dashboard
- Verify `convex/auth.ts` is deployed
- Ensure user email is valid

**Middleware not working**
- Verify `middleware.ts` is in project root (not `/src`)
- Check matcher configuration
- Restart dev server after changes

**Build errors**
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && bun install`
- Check TypeScript errors: `bunx tsc --noEmit`

For more help, check:
- [WorkOS Support](https://workos.com/docs/support)
- [Convex Discord](https://convex.dev/community)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

---

Built with ❤️ using Next.js, Convex, and WorkOS.

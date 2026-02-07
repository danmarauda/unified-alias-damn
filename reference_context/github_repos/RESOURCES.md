# GitHub Repository Resources

## Next.js + Convex Examples

### Official & Recommended
1. **convex-dev/convex-nextjs-starter**
   - URL: `https://github.com/convex-dev/convex-nextjs-starter`
   - Description: Official Next.js + Convex starter template
   - Relevance: Core integration patterns
   - Strategy: MIRROR

2. **convex-dev/convex-examples**
   - URL: `https://github.com/convex-dev/convex-examples`
   - Description: Official Convex examples repository
   - Relevance: Schema patterns, queries, mutations
   - Strategy: MIRROR

3. **get-convex/convex-nextjs-dashboard**
   - URL: `https://github.com/get-convex/convex-nextjs-dashboard`
   - Description: Dashboard example with Convex
   - Relevance: Real-time dashboard patterns
   - Strategy: MIRROR

## WorkOS Integration

4. **workos/nextjs-starter**
   - URL: `https://github.com/workos/nextjs-starter`
   - Description: Official WorkOS Next.js starter
   - Relevance: AuthKit integration patterns
   - Strategy: MIRROR

5. **workos/workos-js**
   - URL: `https://github.com/workos/workos-js`
   - Description: WorkOS JavaScript SDK
   - Relevance: API usage patterns
   - Strategy: MIRROR

## AI SDK Examples

6. **vercel/ai**
   - URL: `https://github.com/vercel/ai`
   - Description: Vercel AI SDK source code
   - Relevance: Core SDK patterns, provider integration
   - Strategy: MIRROR

7. **vercel/ai-chatbot**
   - URL: `https://github.com/vercel/ai-chatbot`
   - Description: AI chatbot example
   - Relevance: Chat UI patterns, streaming
   - Strategy: MIRROR

8. **vercel/ai-examples**
   - URL: `https://github.com/vercel/ai-examples`
   - Description: AI SDK example collection
   - Relevance: Multi-provider patterns, structured outputs
   - Strategy: MUTATE

## shadcn/ui

9. **shadcn-ui/ui**
   - URL: `https://github.com/shadcn-ui/ui`
   - Description: shadcn/ui component library
   - Relevance: Component patterns, Radix integration
   - Strategy: MIRROR

10. **shadcn-ui/next-template**
    - URL: `https://github.com/shadcn-ui/next-template`
    - Description: Next.js template with shadcn/ui
    - Relevance: Setup patterns, configuration
    - Strategy: MIRROR

## Advanced Patterns

11. **t3-oss/create-t3-app**
    - URL: `https://github.com/t3-oss/create-t3-app`
    - Description: T3 Stack starter (Next.js + TypeScript + tRPC)
    - Relevance: Type-safe patterns, architecture
    - Strategy: MUTATE

12. **vercel/next.js**
    - URL: `https://github.com/vercel/next.js`
    - Description: Next.js framework source
    - Relevance: Framework internals, App Router patterns
    - Strategy: MUTATE

13. **pmndrs/react-three-fiber**
    - URL: `https://github.com/pmndrs/react-three-fiber`
    - Description: React renderer for Three.js
    - Relevance: 3D visualization patterns
    - Strategy: MIRROR

## SaaS Templates

14. **vercel/nextjs-subscription-payments**
    - URL: `https://github.com/vercel/nextjs-subscription-payments`
    - Description: Subscription payment example
    - Relevance: SaaS patterns, payments
    - Strategy: MUTATE

15. **vercel/nextjs-postgres**
    - URL: `https://github.com/vercel/nextjs-postgres`
    - Description: Next.js + Postgres example
    - Relevance: Database patterns (alternative to Convex)
    - Strategy: MUTATE

---

## Cloning Instructions

To clone these repositories into this directory:

```bash
cd reference_context/github_repos

# Official examples
git clone https://github.com/convex-dev/convex-nextjs-starter.git
git clone https://github.com/get-convex/convex-nextjs-dashboard.git
git clone https://github.com/workos/nextjs-starter.git

# AI SDK
git clone https://github.com/vercel/ai.git
git clone https://github.com/vercel/ai-examples.git

# UI Components
git clone https://github.com/shadcn-ui/ui.git
git clone https://github.com/shadcn-ui/next-template.git
```

---

## Repository Analysis

Each repository should be analyzed for:
1. **Architecture patterns** matching our stack
2. **Code organization** best practices
3. **Type safety** implementations
4. **Performance** optimizations
5. **Error handling** patterns

See `../patterns/` for extracted patterns from these repos.



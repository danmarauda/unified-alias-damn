# Curation Strategy Guide

## Strategy Types

### MIRROR Strategy (Stabilization)
**Focus:** Resources that strictly align with current versions and patterns

**Use When:**
- Stabilizing existing features
- Debugging compatibility issues
- Maintaining consistency
- Production stability is priority

**Resource Selection:**
- Exact version matches (Next.js 16, Convex 1.29, etc.)
- Same architectural patterns
- Proven, battle-tested implementations
- Official documentation for current versions

**Example:**
- ✅ Next.js 16 App Router examples
- ✅ Convex 1.29 schema patterns
- ✅ WorkOS AuthKit 2.11 guides
- ❌ Next.js 15 or 17 examples
- ❌ Alternative auth solutions

---

### MUTATE Strategy (Innovation)
**Focus:** Resources solving similar problems with newer/alternative approaches

**Use When:**
- Exploring new patterns
- Performance optimization
- Feature enhancement
- Future-proofing

**Resource Selection:**
- Newer library versions
- Alternative architectures
- Modern best practices
- Experimental patterns
- Cross-stack comparisons

**Example:**
- ✅ Next.js 17 features (preview)
- ✅ Alternative real-time solutions
- ✅ New AI SDK patterns
- ✅ Modern React patterns (19+)
- ✅ Alternative UI libraries

---

## Current Strategy: MUTATE

The project is currently using **MUTATE** strategy to:
1. Explore Next.js 17 features
2. Evaluate alternative real-time solutions
3. Discover modern React 19 patterns
4. Find performance optimizations
5. Identify architectural improvements

---

## Switching Strategies

To switch strategies, update the `CURATION_STRATEGY` variable in this file:

```markdown
## Current Strategy: MIRROR
```

Then regenerate the index with the new strategy focus.

---

## Strategy Impact on Index

The `INDEX.md` file will be filtered based on the active strategy:
- **MIRROR:** Only includes resources matching current stack
- **MUTATE:** Includes innovative alternatives and newer patterns



# Design System Token Plan
## ALIAS Super Admin Console - Forensic Analysis & Recommendations

**Generated:** 2026-02-07
**Status:** Comprehensive Token System Analysis
**Scope:** Color, Spacing, Typography, Shadows, Border Radius, Component Patterns

---

## Executive Summary

The ALIAS Super Admin Console currently uses **Tailwind CSS v4** with **shadcn/ui components** and **CSS custom properties** for theming. While the foundation is solid, significant inconsistencies exist in color usage, spacing patterns, and typography scales across the codebase.

**Key Findings:**
- **Inconsistent gray scales:** Mix of `gray-`, `neutral-`, and CSS custom properties
- **Hardcoded values:** Numerous magic numbers for spacing and colors
- **Typography fragmentation:** Mixed font weights and sizes without clear hierarchy
- **Shadow inconsistencies:** Multiple shadow patterns without systematic approach
- **Border radius variations:** `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` used interchangeably

---

## 1. Current State Inventory

### 1.1 Color Tokens

#### CSS Custom Properties (globals.css)

**Light Mode (:root)**
```css
--background: 0 0% 98%;              /* #fafafa */
--foreground: 240 10% 3.9%;          /* #0a0a0a */
--card: 0 0% 100%;                   /* #ffffff */
--card-foreground: 240 10% 3.9%;
--popover: 0 0% 100%;
--popover-foreground: 240 10% 3.9%;
--primary: 227 71% 57%;              /* #3b82f6 - blue-500 equivalent */
--primary-foreground: 0 0% 98%;
--secondary: 240 4.8% 95.9%;         /* #f4f4f5 - zinc-100 */
--secondary-foreground: 240 5.9% 10%;
--muted: 240 4.8% 95.9%;
--muted-foreground: 240 3.8% 46.1%;  /* #71717a - zinc-500 */
--accent: 227 71% 95%;               /* #eff6ff - blue-50 */
--accent-foreground: 227 71% 57%;
--destructive: 0 84.2% 60.2%;        /* #ef4444 - red-500 */
--destructive-foreground: 0 0% 98%;
--border: 240 5.9% 90%;              /* #e4e4e7 - zinc-200 */
--input: 240 5.9% 90%;
--ring: 227 71% 57%;
--radius: 0.5rem;
--chart-1: 227 71% 57%;              /* Blue */
--chart-2: 263 70% 50%;              /* Purple */
--chart-3: 173 58% 39%;              /* Green */
--chart-4: 43 74% 66%;               /* Yellow */
--chart-5: 346 77% 49%;              /* Pink */
```

**Dark Mode (.dark)**
```css
--background: 0 0% 5%;               /* #0d0d0d */
--foreground: 0 0% 98%;              /* #fafafa */
--card: 0 0% 7%;                     /* #121212 */
--card-foreground: 0 0% 98%;
--primary: 227 71% 57%;              /* Same blue in dark mode */
--primary-foreground: 0 0% 5%;
--secondary: 240 3.7% 15.9%;         /* #27272a - zinc-800 */
--muted: 0 0% 15%;                   /* #262626 */
--muted-foreground: 0 0% 60%;        /* #999999 */
--border: 0 0% 20%;                  /* #333333 */
```

#### Tailwind Color Usage (Inconsistent Patterns)

**Gray Scale Variations Found:**
- `gray-50`, `gray-100`, `gray-200`, `gray-400`, `gray-500`, `gray-600`, `gray-700`, `gray-800`, `gray-900`
- `neutral-800`, `neutral-100`
- `zinc-*` (configured as baseColor in shadcn)

**Semantic Color Patterns:**
- `text-gray-900` / `dark:text-white` (primary text)
- `text-gray-600` / `dark:text-gray-400` (secondary text)
- `text-gray-500` / `dark:text-gray-400` (tertiary text)
- `bg-gray-50` / `dark:bg-gray-800/50` (subtle backgrounds)
- `bg-gray-200` / `dark:bg-gray-700` (skeleton loaders)
- `bg-white` / `dark:bg-gray-800` (card backgrounds)

**Status Colors:**
- `bg-green-500` (success indicators)
- `bg-blue-500` (progress indicators)
- `bg-indigo-500/10` with `text-indigo-600` (accent badges)
- `bg-yellow-500/80` (warning badges)
- `bg-primary/10` with `text-primary` (primary badges)

#### Chart Colors
Five distinct chart colors defined but no systematic approach to usage:
1. Blue (227 71% 57%) - Primary data
2. Purple (263 70% 50%) - Secondary data
3. Green (173 58% 39%) - Success/positive
4. Yellow (43 74% 66%) - Warning/caution
5. Pink (346 77% 49%) - Accent/emphasis

### 1.2 Spacing Tokens

#### Current Spacing Patterns

**Tailwind Utility Usage:**
- `gap-1`, `gap-2`, `gap-4`, `gap-6`, `gap-8` (flex/grid gaps)
- `p-2`, `p-3`, `p-4`, `p-5`, `p-6` (padding)
- `px-2`, `px-3`, `px-4`, `px-8` (horizontal padding)
- `py-0.5`, `py-1`, `py-2` (vertical padding)
- `mb-1`, `mb-2`, `mb-4`, `mb-6` (margin bottom)
- `mt-1`, `mt-2` (margin top)
- `space-y-1.5`, `space-y-4`, `space-y-6` (vertical stacking)

**Component-Specific Spacing:**
- Cards: `p-5`, `p-6` (inconsistent)
- Buttons: `px-4 py-2` (default), `px-3` (sm), `px-8` (lg)
- Inputs: `px-3 py-2`
- Badges: `px-2 py-0.5`, `px-2 py-1` (inconsistent)

**Inconsistencies:**
- Cards use both `p-5` and `p-6` without clear distinction
- Badges have two different padding patterns
- No consistent spacing scale for margins between sections

### 1.3 Typography Tokens

#### Font Family
```css
font-family: "ALIAS-Light", system-ui, sans-serif;  /* 300 weight */
font-weight: 300;  /* Base weight */
```

**Note:** Custom fonts (Dria-Light.otf, Dria-Regular.otf) are commented out due to missing files.

#### Font Size Patterns

**Headings:**
- `text-2xl` - Page titles (e.g., "User Profile", "AI Agents Dashboard")
- `text-xl` - Section titles (e.g., "WorkOS Dashboard")
- `text-lg` - Card titles (e.g., "Profile", recent agents)
- `text-base` - Subsection titles

**Body Text:**
- `text-sm` - Standard body text, labels
- `text-xs` - Metadata, timestamps, secondary info

**Font Weights:**
- `font-light` (300) - Large display text
- `font-normal` (400) - Default text
- `font-medium` (500) - Emphasized text, labels
- `font-semibold` (600) - Headings, important text
- `font-bold` (700) - Strong emphasis

#### Typography Inconsistencies

1. **No clear heading hierarchy** - `text-2xl` used for main titles, but no defined h1-h6 scale
2. **Mixed semantic meaning** - `text-sm` used for both body text and labels
3. **Inconsistent heading styles** - Some headings use `font-semibold`, others use `font-medium`
4. **No line-height tokens** - Implicit Tailwind defaults used

### 1.4 Shadow Tokens

#### Current Shadow Patterns

**Component Shadows:**
- `shadow` - Default button shadow
- `shadow-sm` - Outline buttons, secondary buttons
- `shadow-lg` - Hover states (cards, skill cards)
- No custom shadow definitions in Tailwind config

**Inconsistencies:**
- No systematic approach to elevation levels
- Hover states jump from no shadow to `shadow-lg`
- No shadows defined for cards (despite cards having `shadow` class)

### 1.5 Border Radius Tokens

#### Current Border Radius Patterns

- `rounded-md` - Buttons, small interactive elements (0.375rem / 6px)
- `rounded-lg` - Cards, larger containers (0.5rem / 8px)
- `rounded-xl` - Cards (primary card style) (0.75rem / 12px)
- `rounded-full` - Circular elements (avatars, status indicators)
- `rounded-sm` - Small accent elements (0.125rem / 2px)

**Inconsistencies:**
- Cards use both `rounded-lg` and `rounded-xl` without clear distinction
- Buttons default to `rounded-md` but size variants override to `rounded-md` (redundant)
- No documented when to use which radius

### 1.6 Component Patterns

#### Button Component (shadcn/ui)

```typescript
variants: {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
}
sizes: {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
}
```

#### Card Component (shadcn/ui)

```typescript
Card: "rounded-xl border bg-card text-card-foreground shadow"
CardHeader: "flex flex-col space-y-1.5 p-6"
CardTitle: "font-semibold leading-none tracking-tight"
CardDescription: "text-muted-foreground text-sm"
CardContent: "p-6 pt-0"
CardFooter: "flex items-center p-6 pt-0"
```

---

## 2. Identified Inconsistencies

### 2.1 Color Inconsistencies

| Issue | Examples | Impact |
|-------|----------|--------|
| **Mixed gray scales** | `gray-*`, `neutral-*`, CSS vars | Inconsistent dark mode support |
| **Hardcoded colors** | `bg-indigo-500/10`, `bg-blue-300` | Breaking theme consistency |
| **Status color fragmentation** | `bg-green-500`, `bg-blue-500` inline | No reusable status tokens |
| **Text color patterns** | `text-gray-900` vs `text-foreground` | Semantic naming not enforced |
| **Background patterns** | `bg-white` vs `bg-card` | Theme-awareness inconsistent |

**Critical Issues:**
1. **Primary blue used inconsistently:** CSS var (`--primary: 227 71% 57%`) but inline `bg-blue-500` also used
2. **Dark mode overrides:** Many components use `dark:bg-gray-800` instead of semantic `dark:bg-card`
3. **Chart colors unused:** Five chart colors defined but no clear usage pattern

### 2.2 Spacing Inconsistencies

| Issue | Examples | Impact |
|-------|----------|--------|
| **Arbitrary values** | `py-0.5`, `space-y-1.5` | Breaks spacing scale |
| **Inconsistent card padding** | `p-5` vs `p-6` | No visual rhythm |
| **Mixed margin units** | `mb-1`, `mb-2`, `mb-4`, `mb-6` | No systematic scale |
| **Gap inconsistencies** | `gap-1` vs `gap-2` vs `gap-4` | Unclear hierarchy |

### 2.3 Typography Inconsistencies

| Issue | Examples | Impact |
|-------|----------|--------|
| **No heading scale** | `text-2xl`, `text-xl`, `text-lg` ad-hoc | Inconsistent visual hierarchy |
| **Font weight chaos** | `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold` | Unclear emphasis hierarchy |
| **Missing line heights** | No custom line-height tokens | Poor readability control |
| **Custom fonts missing** | Dria fonts commented out | Fallback to system fonts |

### 2.4 Shadow & Border Radius Inconsistencies

| Issue | Examples | Impact |
|-------|----------|--------|
| **No elevation system** | `shadow`, `shadow-sm`, `shadow-lg` only | No intermediate depth levels |
| **Card radius confusion** | `rounded-lg` vs `rounded-xl` | Inconsistent card styles |
| **No animation tokens** | `transition-all duration-300` inline | Inconsistent motion design |

---

## 3. Recommended Token System

### 3.1 Naming Convention

Adopt a **semantic hierarchical naming** pattern:

```
<category>-<semantic-name>-<variant>-<state>
```

**Examples:**
- `color-primary-default` → Base primary color
- `color-primary-hover` → Primary hover state
- `spacing-component-card` → Card padding
- `spacing-element-gap` → Gap between elements
- `typography-heading-h1` → Level 1 heading
- `typography-body-default` → Default body text

### 3.2 Token Categories

#### A. Color Tokens

**Semantic Palette:**
```css
/* Primary - Brand/Action */
--color-primary-default: 227 71% 57%;        /* #3b82f6 */
--color-primary-hover: 227 71% 52%;           /* Slightly darker */
--color-primary-active: 227 71% 47%;          /* Even darker */
--color-primary-subtle: 227 71% 95%;          /* #eff6ff */

/* Secondary - Less prominent actions */
--color-secondary-default: 240 4.8% 95.9%;
--color-secondary-hover: 240 4.8% 90%;
--color-secondary-active: 240 4.8% 85%;

/* Accent - Emphasis/Highlight */
--color-accent-default: 227 71% 95%;
--color-accent-hover: 227 71% 90%;
--color-accent-text: 227 71% 57%;

/* Neutral - Text, borders, backgrounds */
--color-neutral-text-primary: 240 10% 3.9%;    /* #0a0a0a */
--color-neutral-text-secondary: 240 3.8% 46.1%; /* #71717a */
--color-neutral-text-tertiary: 240 5% 64.9%;   /* #a1a1aa */
--color-neutral-border-default: 240 5.9% 90%;
--color-neutral-border-strong: 240 5.9% 80%;
--color-neutral-bg-default: 0 0% 98%;
--color-neutral-bg-subtle: 0 0% 96%;
--color-neutral-bg-elevated: 0 0% 100%;

/* Status - Semantic states */
--color-status-success: 142 76% 36%;           /* #16a34a */
--color-status-success-bg: 142 76% 96%;
--color-status-warning: 43 74% 66%;            /* #eab308 */
--color-status-warning-bg: 43 74% 96%;
--color-status-error: 0 84.2% 60.2%;           /* #ef4444 */
--color-status-error-bg: 0 84.2% 96%;
--color-status-info: 227 71% 57%;              /* Reuse primary */
--color-status-info-bg: 227 71% 96%;

/* Chart - Data visualization */
--color-chart-1: 227 71% 57%;                  /* Blue */
--color-chart-2: 263 70% 50%;                  /* Purple */
--color-chart-3: 173 58% 39%;                  /* Green */
--color-chart-4: 43 74% 66%;                   /* Yellow */
--color-chart-5: 346 77% 49%;                  /* Pink */
```

**Dark Mode Overrides:**
```css
.dark {
  --color-neutral-text-primary: 0 0% 98%;
  --color-neutral-text-secondary: 0 0% 60%;
  --color-neutral-text-tertiary: 0 0% 45%;
  --color-neutral-border-default: 0 0% 20%;
  --color-neutral-border-strong: 0 0% 25%;
  --color-neutral-bg-default: 0 0% 5%;
  --color-neutral-bg-subtle: 0 0% 10%;
  --color-neutral-bg-elevated: 0 0% 7%;
}
```

#### B. Spacing Tokens

**Spacing Scale (4px base unit):**
```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
```

**Semantic Spacing:**
```css
/* Component spacing */
--spacing-card-padding: var(--spacing-6);
--spacing-card-padding-sm: var(--spacing-4);
--spacing-section-gap: var(--spacing-8);
--spacing-element-gap: var(--spacing-4);

/* Element spacing */
--spacing-button-padding-inline: var(--spacing-4);
--spacing-button-padding-block: var(--spacing-2);
--spacing-input-padding-inline: var(--spacing-3);
--spacing-input-padding-block: var(--spacing-2);
--spacing-badge-padding-inline: var(--spacing-2);
--spacing-badge-padding-block: var(--spacing-1);
```

#### C. Typography Tokens

**Font Sizes (Type Scale):**
```css
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 1.875rem;   /* 30px */
--font-size-4xl: 2.25rem;    /* 36px */
```

**Font Weights:**
```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Line Heights:**
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

**Semantic Typography:**
```css
/* Headings */
--typography-h1: var(--font-size-4xl) / var(--line-height-tight) var(--font-weight-bold);
--typography-h2: var(--font-size-3xl) / var(--line-height-tight) var(--font-weight-semibold);
--typography-h3: var(--font-size-2xl) / var(--line-height-tight) var(--font-weight-semibold);
--typography-h4: var(--font-size-xl) / var(--line-height-normal) var(--font-weight-medium);
--typography-h5: var(--font-size-lg) / var(--line-height-normal) var(--font-weight-medium);
--typography-h6: var(--font-size-base) / var(--line-height-normal) var(--font-weight-medium);

/* Body */
--typography-body-large: var(--font-size-lg) / var(--line-height-normal) var(--font-weight-normal);
--typography-body-default: var(--font-size-base) / var(--line-height-normal) var(--font-weight-normal);
--typography-body-small: var(--font-size-sm) / var(--line-height-normal) var(--font-weight-normal);
--typography-body-xs: var(--font-size-xs) / var(--line-height-normal) var(--font-weight-normal);

/* Labels */
--typography-label-large: var(--font-size-sm) / var(--line-height-normal) var(--font-weight-medium);
--typography-label-default: var(--font-size-sm) / var(--line-height-normal) var(--font-weight-normal);
--typography-label-small: var(--font-size-xs) / var(--line-height-normal) var(--font-weight-medium);
```

#### D. Shadow Tokens

**Elevation System:**
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

**Semantic Shadows:**
```css
--shadow-card: var(--shadow-sm);
--shadow-card-hover: var(--shadow-md);
--shadow-dropdown: var(--shadow-lg);
--shadow-modal: var(--shadow-xl);
--shadow-button: var(--shadow-sm);
```

#### E. Border Radius Tokens

**Radius Scale:**
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

**Semantic Radius:**
```css
--radius-button: var(--radius-md);
--radius-card: var(--radius-xl);
--radius-input: var(--radius-md);
--radius-badge: var(--radius-full);
--radius-avatar: var(--radius-full);
--radius-pill: var(--radius-full);
```

#### F. Animation Tokens

**Duration:**
```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

**Easing:**
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
```

**Semantic Transitions:**
```css
--transition-base: var(--duration-base) var(--ease-default);
--transition-hover: var(--duration-fast) var(--ease-out);
--transition-modal: var(--duration-slow) var(--ease-default);
```

---

## 4. Implementation Strategy

### 4.1 Phase 1: Token Definition (Week 1)

**Tasks:**
1. Create `src/styles/tokens.css` with all design tokens
2. Update `globals.css` to import and use tokens
3. Document token values in Design System doc

**Files to Create/Modify:**
- `/src/styles/tokens.css` - NEW: All design tokens
- `/src/app/globals.css` - UPDATE: Import tokens, refactor to use them
- `/docs/DESIGN_SYSTEM.md` - NEW: Token documentation

### 4.2 Phase 2: Component Migration (Weeks 2-3)

**Priority Order:**
1. **Foundation components** (Button, Card, Input, Badge)
2. **Layout components** (Header, Footer, MainLayout)
3. **Feature components** (Dashboard widgets, Forms, Tables)
4. **Page-level components** (App pages)

**Migration Pattern:**
```typescript
// Before
<Button className="bg-blue-500 hover:bg-blue-600">Click</Button>
<Card className="rounded-lg p-5 shadow-lg">

// After
<Button variant="primary">Click</Button>
<Card className="card-padding">  // Uses token-based padding
```

### 4.3 Phase 3: Validation & Documentation (Week 4)

**Tasks:**
1. Audit all components for hardcoded values
2. Create visual regression tests
3. Document component examples using tokens
4. Update CLAUDE.md with token usage guidelines

---

## 5. Code Examples

### 5.1 Token-Based Button Component

```typescript
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] font-medium text-sm transition-[background,color,border-color,box-shadow] [transition:var(--transition-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--color-primary-default))] text-[hsl(var(--color-primary-foreground))] shadow-[var(--shadow-button)] hover:bg-[hsl(var(--color-primary-hover))]",
        destructive:
          "bg-[hsl(var(--color-status-error))] text-[hsl(var(--color-status-error-foreground))] shadow-[var(--shadow-button)] hover:bg-[hsl(var(--color-status-error-hover))]",
        outline:
          "border border-[hsl(var(--color-neutral-border-default))] bg-[hsl(var(--color-neutral-bg-default))] shadow-[var(--shadow-button)] hover:bg-[hsl(var(--color-neutral-bg-subtle))] hover:text-[hsl(var(--color-neutral-text-primary))]",
        secondary:
          "bg-[hsl(var(--color-secondary-default))] text-[hsl(var(--color-secondary-foreground))] shadow-[var(--shadow-button)] hover:bg-[hsl(var(--color-secondary-hover))]",
        ghost: "hover:bg-[hsl(var(--color-accent-default))] hover:text-[hsl(var(--color-accent-text))]",
        link: "text-[hsl(var(--color-primary-default))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-[var(--spacing-button-padding-inline)] py-[var(--spacing-button-padding-block)]",
        sm: "h-8 rounded-[var(--radius-button)] px-[var(--spacing-3)] text-[var(--font-size-xs)]",
        lg: "h-10 rounded-[var(--radius-button)] px-[var(--spacing-8)]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 5.2 Token-Based Card Component

```typescript
// src/components/ui/card.tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "rounded-[var(--radius-card)] border border-[hsl(var(--color-neutral-border-default))] bg-[hsl(var(--color-neutral-bg-elevated))] text-[hsl(var(--color-neutral-text-primary))] shadow-[var(--shadow-card)]",
      className
    )}
    ref={ref}
    {...props}
  />
));

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("flex flex-col gap-[var(--spacing-2)] p-[var(--spacing-card-padding)]", className)}
    ref={ref}
    {...props}
  />
));

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("font-semibold leading-none tracking-tight text-[var(--typography-h3)]", className)}
    ref={ref}
    {...props}
  />
));

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("text-[hsl(var(--color-neutral-text-secondary))] text-[var(--typography-body-small)]", className)}
    ref={ref}
    {...props}
  />
));
```

### 5.3 Status Badge Component (New)

```typescript
// src/components/ui/status-badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-badge)] px-[var(--spacing-badge-padding-inline)] py-[var(--spacing-badge-padding-block)] text-[var(--typography-label-small)] font-medium transition-colors",
  {
    variants: {
      status: {
        success: "bg-[hsl(var(--color-status-success-bg))] text-[hsl(var(--color-status-success))]",
        warning: "bg-[hsl(var(--color-status-warning-bg))] text-[hsl(var(--color-status-warning))]",
        error: "bg-[hsl(var(--color-status-error-bg))] text-[hsl(var(--color-status-error))]",
        info: "bg-[hsl(var(--color-status-info-bg))] text-[hsl(var(--color-status-info))]",
        neutral: "bg-[hsl(var(--color-neutral-bg-subtle))] text-[hsl(var(--color-neutral-text-secondary))]",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props} />
  );
}

export { StatusBadge, statusBadgeVariants };
```

### 5.4 Usage Examples

```typescript
// Before: Hardcoded values
<div className="rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Description
  </p>
</div>

// After: Token-based
<Card className="card-padding">
  <CardTitle>Title</CardTitle>
  <CardDescription>Description</CardDescription>
</Card>

// Before: Hardcoded status badge
<span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-600">
  Active
</span>

// After: Token-based status badge
<StatusBadge status="success">Active</StatusBadge>

// Before: Hardcoded spacing
<div className="flex flex-col gap-4 p-6 mb-8">
  <div className="mb-4">Section 1</div>
  <div className="mb-4">Section 2</div>
</div>

// After: Token-based spacing
<div className="flex flex-col gap-[var(--spacing-element-gap)] p-[var(--spacing-card-padding)] mb-[var(--spacing-section-gap)]">
  <div className="mb-[var(--spacing-4)]">Section 1</div>
  <div className="mb-[var(--spacing-4)]">Section 2</div>
</div>
```

### 5.5 Token File Structure

```css
/* src/styles/tokens.css */

@layer base {
  :root {
    /* Color tokens */
    --color-primary-default: 227 71% 57%;
    --color-primary-hover: 227 71% 52%;
    --color-primary-active: 227 71% 47%;
    --color-primary-subtle: 227 71% 95%;

    /* Spacing tokens */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;

    /* Semantic spacing */
    --spacing-card-padding: var(--spacing-6);
    --spacing-section-gap: var(--spacing-8);
    --spacing-element-gap: var(--spacing-4);

    /* Typography tokens */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;

    /* Semantic typography */
    --typography-h1: var(--font-size-4xl) / 1.25 var(--font-weight-bold);
    --typography-h2: var(--font-size-3xl) / 1.25 var(--font-weight-semibold);
    --typography-h3: var(--font-size-2xl) / 1.25 var(--font-weight-semibold);
    --typography-body-default: var(--font-size-base) / 1.5 var(--font-weight-normal);
    --typography-body-small: var(--font-size-sm) / 1.5 var(--font-weight-normal);

    /* Shadow tokens */
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

    /* Semantic shadows */
    --shadow-card: var(--shadow-sm);
    --shadow-card-hover: var(--shadow-md);
    --shadow-button: var(--shadow-sm);

    /* Border radius tokens */
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-full: 9999px;

    /* Semantic radius */
    --radius-button: var(--radius-md);
    --radius-card: var(--radius-xl);
    --radius-input: var(--radius-md);
    --radius-badge: var(--radius-full);

    /* Animation tokens */
    --duration-fast: 150ms;
    --duration-base: 200ms;
    --duration-slow: 300ms;
    --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --transition-hover: var(--duration-fast) var(--ease-out);
    --transition-base: var(--duration-base) var(--ease-default);
  }

  .dark {
    /* Dark mode color overrides */
    --color-neutral-text-primary: 0 0% 98%;
    --color-neutral-text-secondary: 0 0% 60%;
    --color-neutral-border-default: 0 0% 20%;
    --color-neutral-bg-default: 0 0% 5%;
    --color-neutral-bg-elevated: 0 0% 7%;
  }
}
```

---

## 6. Usage Guidelines

### 6.1 When to Use Tokens

**USE tokens for:**
- All component styling (buttons, cards, inputs, etc.)
- Layout spacing (margins, padding, gaps)
- Typography (font sizes, weights, line heights)
- Colors (backgrounds, text, borders)
- Shadows and border radius

**DO NOT use tokens for:**
- One-off layout adjustments (use arbitrary values sparingly)
- Temporary experimental styles
- Third-party component overrides

### 6.2 Token Selection Guide

**Color Selection:**
```typescript
// Primary actions
<Button variant="default">Submit</Button>

// Destructive actions
<Button variant="destructive">Delete</Button>

// Status indication
<StatusBadge status="success">Active</StatusBadge>
<StatusBadge status="error">Failed</StatusBadge>
<StatusBadge status="warning">Pending</StatusBadge>

// Neutral backgrounds
<Card>Content</Card>

// Emphasized content
<Badge variant="accent">New</Badge>
```

**Spacing Selection:**
```typescript
// Card content
<CardHeader p-[var(--spacing-card-padding)]>

// Element gaps
<div className="flex gap-[var(--spacing-element-gap)]">

// Section separation
<section className="mb-[var(--spacing-section-gap)]">
```

**Typography Selection:**
```typescript
// Page title
<h1 style="font: var(--typography-h1)">Dashboard</h1>

// Card title
<CardTitle style="font: var(--typography-h3)">Stats</CardTitle>

// Body text
<p style="font: var(--typography-body-default)">Description</p>

// Labels
<label style="font: var(--typography-label-default)">Email</label>
```

### 6.3 Migration Checklist

- [ ] Replace hardcoded colors with semantic color tokens
- [ ] Replace arbitrary spacing values with spacing tokens
- [ ] Replace inline font sizes with typography tokens
- [ ] Replace hardcoded shadows with shadow tokens
- [ ] Replace hardcoded border radius with radius tokens
- [ ] Add transition tokens to all interactive elements
- [ ] Remove `dark:` prefixes in favor of token-based dark mode
- [ ] Update component documentation with token usage

---

## 7. Migration Strategy

### 7.1 Backward Compatibility

**Approach:** Gradual migration with feature flags

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      // Keep existing utilities for backward compatibility
      colors: {
        primary: {
          DEFAULT: "hsl(var(--color-primary-default))",
          hover: "hsl(var(--color-primary-hover))",
        },
        // ... other mappings
      },
      spacing: {
        'card-padding': 'var(--spacing-card-padding)',
        'section-gap': 'var(--spacing-section-gap)',
      },
    },
  },
};
```

### 7.2 Component Migration Order

**Week 1: Foundation**
- Button
- Card
- Input
- Badge
- StatusBadge (new)

**Week 2: Layout**
- Header
- Footer
- MainLayout
- Sidebar (if exists)

**Week 3: Feature Components**
- Dashboard widgets
- Client profiles
- Skills components
- Research components

**Week 4: Pages & Polish**
- All page-level components
- Remove legacy patterns
- Update documentation

### 7.3 Testing Strategy

**Visual Regression Tests:**
```typescript
// tests/e2e/design-tokens.spec.ts
import { test, expect } from '@playwright/test';

test('design token consistency', async ({ page }) => {
  await page.goto('/dashboard');

  // Check button colors use tokens
  const button = page.locator('button').first();
  const bgColor = await button.evaluate(el =>
    getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toBe('rgb(59, 130, 246)'); // Primary blue

  // Check card spacing uses tokens
  const card = page.locator('.card').first();
  const padding = await card.evaluate(el =>
    getComputedStyle(el).padding
  );
  expect(padding).toBe('24px'); // spacing-6
});
```

---

## 8. Risks & Mitigation

### 8.1 Identified Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Breaking changes** | High | Gradual migration with backward compatibility |
| **Developer adoption** | Medium | Comprehensive documentation and examples |
| **Dark mode regressions** | High | Automated visual regression tests |
| **Performance overhead** | Low | CSS custom properties are performant |
| **Token maintenance** | Medium | Document token addition process |

### 8.2 Rollback Strategy

- Keep all existing Tailwind utilities during migration
- Use feature flags for token-based components
- Maintain git history for easy reverts
- Document migration progress for pause/resume capability

---

## 9. Success Metrics

### 9.1 Quantitative Metrics

- **Token adoption rate:** >90% of components use tokens
- **Hardcoded value reduction:** <5% of styles use arbitrary values
- **Color consistency:** 100% of colors use semantic tokens
- **Spacing consistency:** 100% of spacing uses token scale
- **Build size:** No significant increase (<5%)

### 9.2 Qualitative Metrics

- **Developer confidence:** Survey on token system clarity
- **Design consistency:** Visual audit for uniform appearance
- **Maintenance efficiency:** Time to update design values
- **Onboarding speed:** Time for new devs to learn system

---

## 10. Next Steps

1. **Review and approve** this token system plan
2. **Create tokens.css** with all defined tokens
3. **Update globals.css** to import tokens
4. **Migrate Button component** as proof of concept
5. **Create migration branch** for gradual rollout
6. **Document component examples** using tokens
7. **Train team** on token usage guidelines
8. **Execute migration** following phased approach
9. **Test thoroughly** with visual regression
10. **Monitor and iterate** based on feedback

---

## Appendix A: File Reference

**Files to Create:**
- `/src/styles/tokens.css` - Complete token definitions
- `/src/components/ui/status-badge.tsx` - Status badge component
- `/docs/DESIGN_SYSTEM.md` - Design system documentation
- `/tests/e2e/design-tokens.spec.ts` - Token validation tests

**Files to Modify:**
- `/src/app/globals.css` - Import tokens, refactor existing styles
- `/src/components/ui/button.tsx` - Use tokens
- `/src/components/ui/card.tsx` - Use tokens
- `/tailwind.config.ts` - Map tokens to utilities
- `/CLAUDE.md` - Add token usage guidelines

**Component Audit List:**
- `/src/components/ui/*` - All 17 UI components
- `/src/components/layout/*` - Header, Footer, MainLayout
- `/src/components/dashboard/*` - 6 dashboard widgets
- `/src/components/client-profiles/*` - Client management
- `/src/components/skills/*` - Skills components
- `/src/components/research/*` - Research components
- `/src/components/observability/*` - Observability UI
- `/src/app/*/page.tsx` - All page components

---

## Appendix B: Token Quick Reference

### Color Tokens
```css
--color-primary-{default,hover,active,subtle}
--color-secondary-{default,hover,active}
--color-accent-{default,hover,text}
--color-neutral-{text-primary,text-secondary,text-tertiary,border-default,border-strong,bg-default,bg-subtle,bg-elevated}
--color-status-{success,success-bg,warning,warning-bg,error,error-bg,info,info-bg}
--color-chart-{1,2,3,4,5}
```

### Spacing Tokens
```css
--spacing-{0,1,2,3,4,5,6,8,10,12,16,20}
--spacing-card-padding
--spacing-card-padding-sm
--spacing-section-gap
--spacing-element-gap
--spacing-button-padding-inline
--spacing-button-padding-block
--spacing-input-padding-inline
--spacing-input-padding-block
--spacing-badge-padding-inline
--spacing-badge-padding-block
```

### Typography Tokens
```css
--font-size-{xs,sm,base,lg,xl,2xl,3xl,4xl}
--font-weight-{light,normal,medium,semibold,bold}
--line-height-{tight,normal,relaxed}
--typography-h{1,2,3,4,5,6}
--typography-body-{large,default,small,xs}
--typography-label-{large,default,small}
```

### Shadow Tokens
```css
--shadow-{xs,sm,md,lg,xl}
--shadow-card
--shadow-card-hover
--shadow-dropdown
--shadow-modal
--shadow-button
```

### Border Radius Tokens
```css
--radius-{none,sm,md,lg,xl,2xl,full}
--radius-button
--radius-card
--radius-input
--radius-badge
--radius-avatar
--radius-pill
```

### Animation Tokens
```css
--duration-{fast,base,slow,slower}
--ease-{default,in,out,in-out}
--transition-{base,hover,modal}
```

---

**Document Status:** Complete
**Last Updated:** 2026-02-07
**Version:** 1.0.0
**Maintainer:** ALIAS Design Systems Team

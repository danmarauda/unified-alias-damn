# Tailwind CSS v4 Upgrade Complete

## Changes Made

### 1. Package Updates
- **Upgraded**: `tailwindcss` from v3.4.18 to **v4.1.18** (latest stable)
- **Upgraded**: `@tailwindcss/postcss` to **v4.1.18** (new PostCSS plugin for v4)

### 2. Configuration Files Updated

#### postcss.config.mjs
- Changed plugin from `tailwindcss: {}` to `"@tailwindcss/postcss": {}`
- This is the new PostCSS plugin name for Tailwind v4

#### src/app/globals.css
- Replaced v3 directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- With v4 import:
  ```css
  @import "tailwindcss";
  ```
- **Fixed `@apply` usage**: Replaced `@apply border-border bg-background text-foreground` with direct CSS properties
  - In v4, `@apply` cannot use custom utilities that reference CSS variables
  - Changed to: `border-color: hsl(var(--border));` etc.

#### tailwind.config.ts
- Fixed `darkMode` syntax from `["class"]` to `"class"` for v4 compatibility
- Config file is now optional in v4 but kept for custom theme extensions

## Key Tailwind v4 Changes to Be Aware Of

### CSS Layer System
Tailwind v4 uses native CSS cascade layers. Your custom CSS in `@layer base` and `@layer components` will work correctly with utility classes.

### Utility Class Changes
Some utilities have been renamed in v4:
- `shadow-sm` → `shadow-xs`
- `shadow` → `shadow-sm`
- `rounded-sm` → `rounded-xs`
- `rounded` → `rounded-sm`
- `blur-sm` → `blur-xs`
- `blur` → `blur-sm`
- `outline-none` → `outline-hidden`
- `ring` → `ring-3`

### CSS Variables
- Use parentheses instead of square brackets: `bg-(--brand-color)` instead of `bg-[--brand-color]`
- Prefer `var(--color-red-500)` over `theme(colors.red.500)`

### Custom Utilities & @apply Directive
**Important**: In Tailwind v4, the `@apply` directive has strict limitations:
- You **cannot** use `@apply` with utilities that reference CSS variables (like `border-border`, `bg-background`)
- Only core Tailwind utilities work with `@apply`
- For custom styles using CSS variables, write them as regular CSS properties

Define custom utilities with the `@utility` directive:
```css
@utility my-utility {
  /* properties */
}
```

**Migration Example:**
```css
/* ❌ v3/v4 - This will error in v4 */
@apply border-border bg-background;

/* ✅ v4 - Use direct CSS properties instead */
border-color: hsl(var(--border));
background-color: hsl(var(--background));
```

## Verification
- ✅ TypeScript compilation passes
- ✅ PostCSS configuration updated
- ✅ Global CSS file migrated
- ✅ Dark mode configuration fixed

## Next Steps
1. Test the application thoroughly
2. Update any custom utility classes if needed
3. Check for deprecated utility usage in components
4. Consider removing `tailwind.config.ts` if not needed (it's optional in v4)

## Resources
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind v4 Documentation](https://tailwindcss.com/docs)
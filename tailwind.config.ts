// Tailwind CSS v4 Configuration
// Note: Tailwind v4 uses CSS-first configuration with @theme directive
// This config file is kept for plugin compatibility (tailwindcss-animate)
// Most configuration should be done in CSS using @theme in globals.css

import type { Config } from "tailwindcss";

export default {
  // Content detection is automatic in v4, but we can still specify paths for compatibility
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dark mode configuration
  darkMode: "class",
  // Plugins (tailwindcss-animate still requires config file)
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

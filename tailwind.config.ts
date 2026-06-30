import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      // Stitch design system tokens
      colors: {
        // Semantic shadcn tokens (CSS variable driven)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand color scale - replaces scattered #1a5c2a hex values
        brand: {
          50:  "#f0f7f0",
          100: "#e8f5e9",
          200: "#c8e6c9",
          400: "#25823c",
          500: "#1a5c2a",
          600: "#154d23",
          700: "#0d3318",
          800: "#14471f",
        },
        // Page-level background tint used in merchant + consumer shells
        "page-bg": "#ffffff",
        // Stitch Material Design 3 color tokens
        "on-error-container": "#93000a",
        "secondary-fixed": "#6ffbbe",
        "on-secondary-fixed-variant": "#005236",
        "tertiary-container": "#424547",
        "surface-container": "#ffffff",
        "on-error": "#ffffff",
        "surface-container-low": "#ffffff",
        "inverse-on-surface": "#ffffff",
        "primary-fixed": "#b0f0d6",
        "on-primary": "#ffffff",
        "surface-bright": "#ffffff",
        "on-secondary": "#ffffff",
        "secondary-fixed-dim": "#4edea3",
        "on-surface": "#141b2b",
        "inverse-surface": "#293040",
        "on-primary-fixed-variant": "#0b513d",
        "outline-variant": "#bfc9c3",
        "inverse-primary": "#95d3ba",
        "surface-dim": "#ffffff",
        "on-secondary-container": "#00714d",
        "secondary-container": "#6cf8bb",
        "surface-tint": "#2b6954",
        "surface-container-highest": "#ffffff",
        "on-surface-variant": "#404944",
        "on-primary-container": "#80bea6",
        "surface": "#ffffff",
        "stitch-primary": "#003527",
        "stitch-secondary": "#006c49",
        "surface-container-high": "#ffffff",
        "on-background": "#141b2b",
        "outline": "#707974",
        "surface-variant": "#ffffff",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "primary-fixed-dim": "#95d3ba",
        "on-secondary-fixed": "#002113",
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed": "#002117",
        "on-tertiary": "#ffffff",
        "primary-container": "#064e3b",
        "on-secondary-fixed-dim": "#4edea3",
      },
      spacing: {
        "container-max": "1440px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        display: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        DEFAULT: "0.25rem",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "sparkle-in": {
          "0%":   { transform: "scale(0.3) rotate(-40deg)", opacity: "0" },
          "60%":  { transform: "scale(1.3) rotate(10deg)",  opacity: "1" },
          "100%": { transform: "scale(1)   rotate(0deg)",   opacity: "1" },
        },
        "pop-in": {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "60%":  { transform: "scale(1.25)", opacity: "1" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        "ai-glow": {
          "0%, 100%": { boxShadow: "0 0 0 3px rgba(139,92,246,0.22)" },
          "50%":      { boxShadow: "0 0 0 6px rgba(139,92,246,0.06)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "sparkle-in": "sparkle-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both",
        "pop-in":     "pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        "ai-glow":    "ai-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;


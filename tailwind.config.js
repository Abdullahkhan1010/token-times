/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Deep imperial navy & royal gold color system matching the Token Times logo:
        primary: "#0C133D", // Deep Imperial Navy matching logo
        "on-primary": "#FFFFFF",
        "primary-container": "#121A4B",
        "on-primary-container": "#A8B4E5",

        // Luminous Royal Gold Accent matching logo symbol strokes (#FBDF53 / #D4AF37):
        accent: "#D4AF37", // Luminous Royal Gold
        "accent-light": "#F3CF55", // Bright Hover Glow Gold
        "accent-dark": "#B08D23",
        "accent-container": "#FAF1D3",
        "on-accent": "#0C133D", // Deep navy text on gold background

        // Secondary Warm Rose-Gold / Bronze Accent:
        secondary: "#B8860B",
        "secondary-container": "#F8EED8",
        "on-secondary": "#FFFFFF",

        // Elegant Textured Rose Gold Warm Background Canvas:
        background: "#F7F0EB",
        surface: "#F7F0EB",
        "on-background": "#0C133D",
        "on-surface": "#0C133D",
        "on-surface-variant": "#5C525A",

        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F2E7E1",
        "surface-container": "#ECE0D8",
        "surface-container-high": "#E4D6CD",
        "surface-container-highest": "#DBCAC0",
        "surface-variant": "#E4D6CD",
        "surface-dim": "#D7C8BE",
        "surface-bright": "#F7F0EB",
        "surface-tint": "#0C133D",

        "outline-variant": "#E2D4CB",
        outline: "#7F707A",
        error: "#BA1A1A",
        "error-container": "#FFDAD6",
        "on-error": "#FFFFFF",
        "on-error-container": "#93000A",
      },


      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        gutter: "24px",
        "container-max": "1280px",
        "margin-desktop": "48px",
        "margin-mobile": "16px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "stack-sm": "8px",
        unit: "4px",
      },
      fontFamily: {
        "body-lg": ["Inter"],
        "data-tabular": ["IBM Plex Sans"],
        "headline-lg-mobile": ["Playfair Display"],
        "headline-md": ["Playfair Display"],
        "display-lg": ["Playfair Display"],
        "headline-lg": ["Playfair Display"],
        "body-md": ["Inter"],
        "label-caps": ["Inter"],
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "data-tabular": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.3)" },
        },
      },
      animation: {
        ticker: "ticker 90s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

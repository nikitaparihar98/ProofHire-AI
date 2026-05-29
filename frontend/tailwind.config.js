/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/pages/LoginPage.jsx",
  ],
  theme: {
    extend: {
      colors: {
        /* New Deep Purple & Cyan palette */
        primary: "#1E1B4B",
        accent: "#0891B2",
        "accent-dark": "#0E7490",
        "bg-main": "#F0F4F8",
        "bg-card": "#FFFFFF",
        "text-primary": "#1E1B4B",
        "text-secondary": "#64748B",
        "border-subtle": "#CBD5E1",
        "rec-hire": "#CFFAFE",
        "rec-maybe": "#FEF3C7",
        "rec-pass": "#FEE2E2",
      },
      spacing: {
        base: "8px",
        lg: "24px",
        md: "16px",
        sm: "12px",
        xl: "32px",
        gutter: "20px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        xs: "4px"
      },
      fontFamily: {
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "headline-xl": ["Hanken Grotesk", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-sm": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "900" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "700" }]
      }
    }
  },
  plugins: []
};

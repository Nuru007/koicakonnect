import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9eeff",
          200: "#bce0ff",
          300: "#8eccff",
          400: "#00AFFF", // Secondary Accent
          500: "#0072FE", // Primary Brand
          600: "#005cd6",
          700: "#0047ad",
          800: "#003c8c",
          900: "#043474",
          950: "#02204c",
        },
        surface: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          800: "#1E293B",
          900: "#0F172A",
          950: "#080D1A",
        }
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at center, rgba(0, 175, 255, 0.18) 0%, rgba(0, 114, 254, 0.08) 45%, transparent 70%)",
        "radial-glow-strong": "radial-gradient(circle at center, rgba(0, 175, 255, 0.3) 0%, rgba(0, 114, 254, 0.15) 50%, transparent 75%)",
        "brand-gradient": "linear-gradient(135deg, #0072FE 0%, #00AFFF 100%)",
        "brand-gradient-subtle": "linear-gradient(135deg, rgba(0, 114, 254, 0.06) 0%, rgba(0, 175, 255, 0.04) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
        "dark-card-gradient": "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
      },
      boxShadow: {
        "brand-sm": "0 2px 10px -2px rgba(0, 114, 254, 0.25)",
        "brand-md": "0 8px 25px -4px rgba(0, 114, 254, 0.3)",
        "brand-lg": "0 16px 40px -8px rgba(0, 114, 254, 0.35)",
        "glow": "0 0 35px -5px rgba(0, 175, 255, 0.4)",
        "card": "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)",
        "card-hover": "0 20px 35px -8px rgba(0, 114, 254, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;

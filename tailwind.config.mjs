/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Palet hijau-emas (Tamansiswa) diambil dari referensi desain spedeta.vercel.app
      colors: {
        primary: {
          50: "#f0f9f3",
          100: "#dcf0e3",
          200: "#bce0c9",
          300: "#8fc9a5",
          400: "#5fa87c",
          500: "#3d8c5d",
          600: "#2d754b",
          700: "#265e3f",
          800: "#214b35",
          900: "#1c3e2c",
          950: "#0e2219",
        },
        accent: {
          100: "#f9ecbf",
          200: "#f3d97f",
          300: "#ecc24a",
          400: "#e6ae29",
          500: "#d6941d",
          600: "#b97415",
          700: "#945514",
        },
        mist: "#f6f8f6",
        earth: { 50: "#faf8f4", 100: "#f2ede3" },
        ink: { DEFAULT: "#1f2933", soft: "#4b5563" },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem", "3xl": "1.5rem" },
      boxShadow: {
        card: "0 1px 2px rgba(28, 62, 44, 0.06), 0 8px 24px -12px rgba(28, 62, 44, 0.18)",
        lift: "0 8px 16px -6px rgba(28, 62, 44, 0.12), 0 24px 48px -20px rgba(28, 62, 44, 0.28)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

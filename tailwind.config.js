/** @type {import('tailwind.config').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ---------------------------------------------------------
      // 🖋️ NEW: GLOBAL TYPOGRAPHY OVERHAUL
      // ---------------------------------------------------------
      fontFamily: {
        // Use your custom fonts first everywhere before any system fallback kicks in
        sans: ['Inter', 'Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        // Display font for headings and premium hero sections
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
        // Monospace stack for code blocks and technical UI
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      // ---------------------------------------------------------

      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },

      animation: {
        'gradient-shift': 'gradient-shift 5s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
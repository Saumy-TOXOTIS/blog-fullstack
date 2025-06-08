// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // We no longer need to require typography here.
  // PostCSS will handle it automatically.
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
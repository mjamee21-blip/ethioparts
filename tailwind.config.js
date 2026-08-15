/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        automotive: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b', // vibrant amber/gold
          600: '#d97706', // rich gold/orange
          700: '#b45309',
          900: '#78350f',
        },
        slate: {
          850: '#151c2c',
          900: '#0f172a',
          950: '#090d16',
        }
      },
    },
  },
  plugins: [],
};

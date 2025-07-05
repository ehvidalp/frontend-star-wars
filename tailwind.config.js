/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        starwars: ['starwars', 'monospace'],
      },
    },
  },
};

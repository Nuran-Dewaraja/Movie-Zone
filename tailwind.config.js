// tailwind.config.js
module.exports = {
  darkMode: 'class', 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cinema-dark': '#0d0d0d',  // or whatever hex you want
      },
    },
  },
  plugins: [],
}
// This is a Tailwind CSS configuration file that specifies the content paths
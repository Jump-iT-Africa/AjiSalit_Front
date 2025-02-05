// tailwind.config.js

module.exports = {
   content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",  // Include all JS, JSX, TS, and TSX files in the app folder
    "./components/**/*.{js,jsx,ts,tsx}",  // Include all JS, JSX, TS, and TSX files in the components folder]
    "./app/(tabs)/meditate.tsx"  
  ],
    theme: {
      extend: {
        fontFamily: {
          tajawal: ['Tajawal'],
          tajawalregular:['TajawalRegular'],
          direction: ['rtl', 'ltr']
        },
        lineHeight: {
          tighter: "1.1",
          looser: "1.8",
          extraLoose: "3",
        },
      },
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('daisyui'),
    ],
    daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#4169e1",        // Royal Blue
            "secondary": "#2B6CB0",      // Secondary blue
            "accent": "#ECC94B",         // Accent yellow
            "neutral": "#3D4451",
            "base-100": "#FFFFFF",
          },
        },
        "light",
        "dark",
      ],
      defaultTheme: "mytheme",
    },
  };
  
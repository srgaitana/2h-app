module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2ecc71",
        "primary-dark": "#27ae60",
        secondary: "#27ae60",
        "secondary-dark": "#219653",
        background: "#eafaf1",
        text: "#2c3e50",
        danger: "#e74c3c",
      },
    },
  },
  plugins: [],
};

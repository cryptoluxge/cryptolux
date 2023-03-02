module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        firago: ["glaho", "regular"],
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        violet: '#801df0',
        violetDark: '#501296',
      }),
      colors: {
        lightBackground: "#0B0B0A",
        lightText: "#C2C2C2",
        lightModal: "#101110",
        lightHover: "#000000",
        lightCard: "#101110",
        lightBorder: "#222222",
        primary: "#CC9600",
        dark: "#320073",
        warning: "#EDC31A",
        info: "#1AAAED",
        error: "#ED1A1A"
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      }
    },
  },
  plugins: [],
}
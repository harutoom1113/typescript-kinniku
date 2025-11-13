// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        // さっきのグラデ再利用
        "brand-gradient": "linear-gradient(90deg, #FF00D6 0%, #FF4D00 100%)",
      },
    },
  },
  plugins: [],
};

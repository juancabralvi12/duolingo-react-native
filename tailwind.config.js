/** @type {import('tailwindcss').Config} */
// Color/type values mirror the TypeScript tokens in src/theme/colors.ts and
// src/theme/typography.ts. Kept in sync manually since tailwind.config.js is
// loaded as plain CommonJS and can't import the .ts source directly.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#6C4EF5",
          "deep-purple": "#5B3BF6",
          blue: "#4D8BFF",
          green: "#21C16B",
        },
        success: "#21C16B",
        warning: "#FFC800",
        streak: "#FF8A00",
        error: "#FF4D4F",
        info: "#4D8BFF",
        text: {
          primary: "#0D132B",
          secondary: "#6B7280",
        },
        border: "#E5E7EB",
        surface: "#F6F7FB",
        background: "#FFFFFF",
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "38px" }],
        h2: ["24px", { lineHeight: "31px" }],
        h3: ["20px", { lineHeight: "26px" }],
        h4: ["16px", { lineHeight: "22px" }],
        "body-lg": ["16px", { lineHeight: "26px" }],
        "body-md": ["14px", { lineHeight: "22px" }],
        "body-sm": ["13px", { lineHeight: "21px" }],
        caption: ["11px", { lineHeight: "15px" }],
      },
    },
  },
  plugins: [],
};

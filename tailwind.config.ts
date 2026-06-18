import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fluid-morph": {
          "0%": {
            borderRadius: "39% 61% 55% 45% / 44% 37% 63% 56%",
            backgroundImage:
              "linear-gradient(120deg, #7e7e7e 0%, #7f7f7f7f 100%)",
          },
          "25%": {
            borderRadius: "45% 55% 48% 52% / 60% 36% 64% 40%",
            backgroundImage:
              "linear-gradient(120deg, #7f7f7f7f 0%, #7f7f7f7f 100%)",
          },
          "50%": {
            borderRadius: "56% 44% 28% 72% / 46% 63% 37% 54%",
            backgroundImage:
              "linear-gradient(120deg, #7f7f7f7f 0%, #7f7f7f7f 100%)",
          },
          "75%": {
            borderRadius: "62% 38% 37% 63% / 39% 32% 68% 61%",
            backgroundImage:
              "linear-gradient(120deg, #7f7f7f7f 0%, #7f7f7f7f 100%)",
          },
          "100%": {
            borderRadius: "39% 61% 55% 45% / 44% 37% 63% 56%",
            backgroundImage:
              "linear-gradient(120deg, #7f7f7f7f 0%, #7f7f7f7f 100%)",
          },
        },
      },
      animation: {
        "fluid-morph": "fluid-morph 5s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

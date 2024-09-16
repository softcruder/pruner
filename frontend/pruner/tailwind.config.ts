import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      typography: (theme: (arg0: string) => unknown) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: theme("colors.primary-dark"),
              },
            },
            strong: {
              color: theme("colors.foreground"),
            },
            "ol > li::before": {
              color: theme("colors.foreground"),
            },
            "ul > li::before": {
              backgroundColor: theme("colors.foreground"),
            },
            hr: {
              borderColor: theme("colors.foreground"),
            },
            blockquote: {
              color: theme("colors.foreground"),
              borderLeftColor: theme("colors.foreground"),
            },
            h1: {
              color: theme("colors.foreground"),
            },
            h2: {
              color: theme("colors.foreground"),
            },
            h3: {
              color: theme("colors.foreground"),
            },
            h4: {
              color: theme("colors.foreground"),
            },
            h5: {
              color: theme("colors.foreground"),
            },
            h6: {
              color: theme("colors.foreground"),
            },
            code: {
              color: theme("colors.foreground"),
            },
            "a code": {
              color: theme("colors.primary"),
            },
            pre: {
              color: theme("colors.foreground"),
              backgroundColor: theme("colors.background"),
            },
            thead: {
              color: theme("colors.foreground"),
              borderBottomColor: theme("colors.foreground"),
            },
            "tbody tr": {
              borderBottomColor: theme("colors.foreground"),
            },
          },
        },
      }),
      backgroundImage: {
        "hero-pattern": "url('/hero-pattern.svg')",
        "base-gradient": "linear-gradient(to right, #144EE3 0%, #EB568E 19%, #A353AA 64%, #144EE3 100%)",
      },
      boxShadow: {
        "inner-primary": "inset 0 0 0 1px var(--primary)",
        "inner-primary-dark": "inset 0 0 0 1px var(--primary-dark)",
        "button-primary": "0 10px 9px 0 #144EE338",
      },
    },
  },
  plugins: [],
};
export default config;

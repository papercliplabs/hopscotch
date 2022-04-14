import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  black: "#17181A",
  blackWhite: {
    50: "rgba(1, 1, 1, 1)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.16)",
    400: "rgba(0, 0, 0, 0.24)",
    500: "#17181A",
    600: "rgba(0, 0, 0, 0.5)", // button hover
    700: "#17181A",
    800: "#17181A",
    900: "#17181A",
  },
};

const radii = {
    none: '0',
    sm: '0.5rem',
    base: '0.75rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    full: '9999px',
}

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
};

const theme = extendTheme({fonts, radii, colors });

export { theme };

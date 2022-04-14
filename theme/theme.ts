import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  blackWhite: {
    50: "rgba(1, 1, 1, 1)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.16)",
    400: "rgba(0, 0, 0, 0.24)",
    500: "rgba(0, 0, 0, 1)",
    600: "rgba(0, 0, 0, 0.5)", // button hover
    700: "rgba(0, 0, 0, 1)",
    800: "rgba(0, 0, 0, 1)",
    900: "rgba(0, 0, 0, 1)",
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

const theme = extendTheme({radii, colors });

export { theme };

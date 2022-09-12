import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#0D88FF",
    800: "#153e75",
    700: "#2a69ac",
  },
  black: "#1B1D1F",
  blackWhite: {
    50: "rgba(1, 1, 1, 1)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.16)",
    400: "rgba(0, 0, 0, 0.24)",
    500: "#1B1D1F",
    600: "rgba(0, 0, 0, 0.5)", // button hover
    700: "#1B1D1F",
    800: "#1B1D1F",
    900: "#1B1D1F",
  },
  negative: "#BE1E1E",
  positive: "#05944F",
  accent: "#FF03D7",
  text0: "#1B1D1F",
  text1: "#3C4242",
  text2: "#C0C1C1",
  bg0: "#FFFFFF",
  bg1: "#EFF0F3",
};

const radii = {
  none: "0",
  sm: "0.5rem",
  base: "0.75rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.75rem",
  full: "9999px",
};

const fonts = {
  heading: "Inter, sans-serif",
  body: "Inter, sans-serif",
};

const textStyles = {
  h1: {
    fontSize: "52px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h2: {
    fontSize: "40px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h3: {
    fontSize: "24px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h4: {
    fontSize: "20px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h5: {
    fontSize: "18px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  h6: {
    fontSize: "18px",
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: '0',
  },
  body1: {
    fontSize: "16px",
    fontWeight: 'regular',
    lineHeight: '24px',
    letterSpacing: '0',
  },
  body2: {
    fontSize: "14px",
    fontWeight: 'regular',
    lineHeight: '20px',
    letterSpacing: '0',
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0',
  },
  eyebrow: {
    fontSize: "14px",
    fontWeight: "bold",
    lineHeight: '20px',
    letterSpacing: '0',
  },
};

const theme = extendTheme({
  fonts,
  radii,
  colors,
  textStyles,
});

export { theme };

import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  dark: {
    50: "rgba(0, 0, 0, 0.04)",
    100: "rgba(0, 0, 0, 0.11)",
    200: "rgba(0, 0, 0, 0.11)",
    300: "rgba(0, 0, 0, 0.11)",
    400: "rgba(0, 0, 0, 0.11)",
    500: "rgba(0, 0, 0, 0.92)",
    600: "rgba(0, 0, 0, 0.11)",
    700: "rgba(0, 0, 0, 0.11)",
    800: "rgba(0, 0, 0, 0.92)",
    900: "",
  },
};

const theme = extendTheme({ colors });

export { theme };

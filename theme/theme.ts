import { extendTheme } from "@chakra-ui/react";

import { colors, semanticTokens } from "./colors";
import { components } from "./components";
import { fonts, textStyles, fontSizes, lineHeights, fontWeights } from "./typography";

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

const styles = {
  global: {
    "html, body": {
      fontFeatureSettings: `'zero' 1`,
      scrollBehavior: "smooth",
    },
  },
};

const theme = extendTheme({
  fonts,
  radii,
  styles,
  components,
  colors,
  fontSizes,
  lineHeights,
  fontWeights,
  textStyles,
  semanticTokens,
});

export { theme };

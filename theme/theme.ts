import { extendTheme } from "@chakra-ui/react";

import { colors, semanticTokens } from "./colors";
import { components } from "./components";
import { fonts, textStyles, fontSizes, lineHeights, fontWeights, pxToRem } from "./typography";

const radii = {
  none: "0",
  xs: pxToRem(16),
  sm: pxToRem(20),
  base: pxToRem(24),
  md: pxToRem(24),
  lg: pxToRem(32),
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.75rem",
  full: pxToRem(1000),
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
  borders: {
    grayDashed: "4px dashed #ABACAE",
  },
});

export { theme };

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
            backgroundColor: "bgPrimary",
        },
    },
};

const breakpoints = {
    xs: pxToRem(330),
    sm: pxToRem(480),
    md: pxToRem(768),
    lg: pxToRem(992),
    xl: pxToRem(1280),
};

const theme = extendTheme({
    shadows: {
        defaultSm: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        defaultMd: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
        defaultLg: "0px 25px 50px -12px rgba(0, 0, 0, 0.16)",
        blueSm: "0px 4px 6px -2px rgba(14, 118, 253, 0.05), 0px 10px 15px -3px rgba(14, 118, 253, 0.1)",
    },
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
    breakpoints,
    borders: {
        grayDashed: "4px dashed #ABACAE",
    },
});

export { theme };

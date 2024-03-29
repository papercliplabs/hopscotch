import color from "color";

const config = {
    darkest: {
        lightness: 10,
        rotate: 0,
        saturate: 0,
    },
    lightest: {
        lightness: 95,
        rotate: 0,
        saturate: 0,
    },
};

export const createShades = (centerColor: string): Record<number, string> => {
    const _color = centerColor;
    const darkSteps = 4;
    const lightSteps = 5;

    const lightnessStep = (config.lightest.lightness - 50) / lightSteps;
    const darknessStep = (50 - config.darkest.lightness) / darkSteps;

    const lightRotateStep = config.lightest.rotate / lightSteps;
    const darkRotateStep = config.darkest.rotate / darkSteps;

    const lightSaturateStep = config.lightest.saturate / lightSteps;
    const darkSaturateStep = config.darkest.saturate / darkSteps;

    return {
        50: color(_color)
            .lightness(50 + lightnessStep * 5)
            .rotate(lightRotateStep * 5)
            .saturate(lightSaturateStep * 5)
            .hex(),
        100: color(_color)
            .lightness(50 + lightnessStep * 4)
            .rotate(lightRotateStep * 4)
            .saturate(lightSaturateStep * 4)
            .hex(),
        200: color(_color)
            .lightness(50 + lightnessStep * 3)
            .rotate(lightRotateStep * 3)
            .saturate(lightSaturateStep * 3)
            .hex(),
        300: color(_color)
            .lightness(50 + lightnessStep * 2)
            .rotate(lightRotateStep * 2)
            .saturate(lightSaturateStep * 2)
            .hex(),
        400: color(_color)
            .lightness(50 + Number(lightnessStep))
            .rotate(Number(lightRotateStep))
            .saturate(Number(lightSaturateStep))
            .hex(),
        500: centerColor,
        600: color(_color)
            .lightness(50 - Number(darknessStep))
            .rotate(Number(darkRotateStep))
            .saturate(Number(darkSaturateStep))
            .hex(),
        700: color(_color)
            .lightness(50 - darknessStep * 2)
            .rotate(darkRotateStep * 2)
            .saturate(darkSaturateStep * 2)
            .hex(),
        800: color(_color)
            .lightness(50 - darknessStep * 3)
            .rotate(darkRotateStep * 3)
            .saturate(darkSaturateStep * 3)
            .hex(),
        900: color(_color)
            .lightness(50 - darknessStep * 4)
            .rotate(darkRotateStep * 4)
            .saturate(darkSaturateStep * 4)
            .hex(),
    };
};

const themeColors = {
    blackAlpha: {
        50: "rgba(0,0,0,0.05)",
        100: "rgba(0,0,0,0.1)",
        200: "rgba(0,0,0,0.2)",
        300: "rgba(0,0,0,0.3)",
        400: "rgba(0,0,0,0.4)",
        500: "rgba(0,0,0,0.5)",
        600: "rgba(0,0,0,0.6)",
        700: "rgba(0,0,0,0.7)",
        800: "rgba(0,0,0,0.8)",
        900: "rgba(0,0,0,0.9)",
    },
    whiteAlpha: {
        50: "rgba(255,255,255,0.05)",
        100: "rgba(255,255,255,0.1)",
        200: "rgba(255,255,255,0.2)",
        300: "rgba(255,255,255,0.3)",
        400: "rgba(255,255,255,0.4)",
        500: "rgba(255,255,255,0.5)",
        600: "rgba(255,255,255,0.6)",
        700: "rgba(255,255,255,0.7)",
        800: "rgba(255,255,255,0.8)",
        900: "rgba(255,255,255,0.9)",
    },
    warningAlpha: {
        100: "rgba(255,127,63,0.1)",
    },
};

const gradients = {
    primary: "linear-gradient(135deg, #E013DD 0%, #F41FEC 52.08%, #FF4E82 100%)",
    brand: "linear-gradient(180deg, #005CB6 0%, #0D88FF 100%)",
};

const borders = {
    dashed: "2px dashed #C0C1C1",
};

export const colors = {
    // theme colors
    ...themeColors,

    gradients,
    borders,

    // primary
    primary: "#0E76FD",
    brand: createShades("#0D88FF"),
    secondary: createShades("#E4F2FF"),
    accent: createShades("#FF03D7"),

    negative: "#FF4949",
    positive: "#3CCF4E",
    textPrimary: "#1B1D1F",
    textSecondary: "rgba(27, 29, 31, 0.6)",
    textTertiary: "#C0C1C1",
    textInteractive: "#0E76FD",
    bgPrimary: "#FAFAFC",
    bgSecondary: "#EFF0F3",
    bgTertiary: "#FAFAFC",

    success: "#3CCF4E",
    critical: "#FF4949",
    warning: "#F9F5DB",
};

// Not nessesary until we have dark mode
export const semanticTokens = {};

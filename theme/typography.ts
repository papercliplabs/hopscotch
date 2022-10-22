export const pxToRem = (px: number): string => `${px / 16}rem`;

export const fontSizes = {
  "2xs": pxToRem(12),
  xs: pxToRem(14),
  sm: pxToRem(16),
  md: pxToRem(18),
  lg: pxToRem(20),
  xl: pxToRem(24),
  "2xl": pxToRem(40),
  "3xl": pxToRem(52),
} as const;

export const lineHeights = {
  xs: pxToRem(16),
  sm: pxToRem(18),
  md: pxToRem(22),
  lg: pxToRem(24),
  xl: pxToRem(28),
  "2xl": pxToRem(48),
  "3xl": pxToRem(60),
} as const;

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  book: 600,
  semibold: 700,
  bold: 800,
} as const;

export const textStyles = {
  h1: {
    fontSize: "3xl",
    fontWeight: "bold",
    lineHeight: "3xl",
    letterSpacing: '-0.03em',
  },
  h2: {
    fontSize: "2xl",
    fontWeight: "bold",
    lineHeight: "xl",
    letterSpacing: '-0.03em',
  },
  h3: {
    fontSize: "xl",
    fontWeight: "bold",
    lineHeight: "xl",
    letterSpacing: '-0.03em',
  },
  h4: {
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "xl",
    letterSpacing: '-0.03em',
  },
  h5: {
    fontSize: "md",
    fontWeight: "bold",
    lineHeight: "md",
    letterSpacing: '-0.03em',
  },
  h6: {
    fontSize: "xs",
    fontWeight: "bold",
    lineHeight: "md",
    letterSpacing: '-0.03em',
  },
  body1: {
    fontSize: "sm",
    fontWeight: "book",
    lineHeight: "md",
    letterSpacing: '-0.03em',
  },
  body2: {
    fontSize: "xs",
    fontWeight: "book",
    lineHeight: "xs",
    letterSpacing: '-0.03em',
  },
  small: {
    fontSize: "2xs",
    fontWeight: "book",
    lineHeight: "xs",
    letterSpacing: '-0.03em',
  },
  label: {
    fontSize: pxToRem(13),
    fontWeight: "medium",
    lineHeight: "sm",
    letterSpacing: '-0.03em',
  },
  eyebrow: {
    fontSize: "xs",
    fontWeight: "semibold",
    lineHeight: "xs",
    letterSpacing: '-0.03em',
  },
} as const;

export const fonts = {
  heading: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
  body: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
};

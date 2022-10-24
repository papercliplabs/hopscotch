export const pxToRem = (px: number): string => `${px / 16}rem`;


export const fontSizes = {
  xs: pxToRem(13),
  sm: pxToRem(14),
  md: pxToRem(16),
  lg: pxToRem(18),
  xl: pxToRem(24),
} as const;


export const lineHeights = {
  sm: pxToRem(18),
  md: pxToRem(20),
  lg: pxToRem(24),
  xl: pxToRem(32),
} as const;

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const textStyles = {
  headline: {
    fontSize: "xl",
    fontWeight: "bold",
    lineHeight: "xl",
    fontFamily: "'Inter Tight', sans-serif",
  },
  titleLg: {
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "lg",
    fontFamily: "'Inter Tight', sans-serif",
  },
  titleMd: {
    fontSize: "md",
    fontWeight: "semibold",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  titleSm: {
    fontSize: "sm",
    fontWeight: "semibold",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  bodyLg: {
    fontSize: "md",
    fontWeight: "medium",
    lineHeight: "lg",
    fontFamily: "'Inter', sans-serif",
    lineSpacing: "-0.011em",
  },
  bodyMd: {
    fontSize: "sm",
    fontWeight: "medium",
    lineHeight: "md",
    fontFamily: "'Inter', sans-serif",
    lineSpacing: "-0.006em",
  },
  bodySm: {
    fontSize: "xs",
    fontWeight: "medium",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  label: {
    fontSize: "xs",
    fontWeight: "semibold",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
} as const;

export const fonts = {
  heading: `"Inter Tight", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
  body: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
};

export const pxToRem = (px: number): string => `${px / 16}rem`;

// export const fontSizes = {
//   "2xs": pxToRem(12),
//   xs: pxToRem(14),
//   sm: pxToRem(16),
//   md: pxToRem(18),
//   lg: pxToRem(20),
//   xl: pxToRem(24),
//   "2xl": pxToRem(40),
//   "3xl": pxToRem(52),
// } as const;

export const fontSizes = {
  xs: pxToRem(13),
  sm: pxToRem(14),
  md: pxToRem(16),
  lg: pxToRem(18),
  xl: pxToRem(24),
} as const;

// export const lineHeights = {
//   xs: pxToRem(16),
//   sm: pxToRem(18),
//   md: pxToRem(22),
//   lg: pxToRem(24),
//   xl: pxToRem(28),
//   "2xl": pxToRem(48),
//   "3xl": pxToRem(60),
// } as const;

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
  book: 600,
  semibold: 700,
  bold: 800,
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
    fontWeight: "bold",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  titleSm: {
    fontSize: "sm",
    fontWeight: "bold",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  bodyLg: {
    fontSize: "md",
    fontWeight: "book",
    lineHeight: "lg",
    fontFamily: "'Inter', sans-serif",
    lineSpacing: "-0.011em",
  },
  bodyMd: {
    fontSize: "sm",
    fontWeight: "book",
    lineHeight: "md",
    fontFamily: "'Inter', sans-serif",
    lineSpacing: "-0.006em",
  },
  bodySm: {
    fontSize: "xs",
    fontWeight: "book",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
  label: {
    fontSize: "xs",
    fontWeight: "medium",
    lineHeight: "md",
    fontFamily: "'Inter Tight', sans-serif",
  },
} as const;

export const fonts = {
  heading: `"Inter Tight", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
  body: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
};

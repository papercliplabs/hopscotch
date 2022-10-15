export const components = {
  Button: {
    baseStyle: {
      borderRadius: "sm",
      color: "textPrimary",
      fontWeight: "semibold",
      _disabled: {
        color: "textPrimaryDisabled",
        bg: "bgButtonDisabled",
        _hover: {
          color: "textPrimaryDisabled",
          bg: "bgButtonDisabled",
          pointerEvents: "none",
        },
      },
      _hover: {
        opacity: "0.7",
      },
    },
    sizes: {
      sm: {
        px: 4,
        py: 2,
        fontSize: "xs",
        lineHeight: "xs",
      },
      md: {
        px: 5,
        py: 3,
        fontSize: "sm",
        lineHeight: "md",
      },
      lg: {
        px: 6,
        py: 4,
        fontSize: "md",
        lineHeight: "lg",
      },
    },
  },
  Modal: {
    baseStyle: {
      overlay: {
        backdropFilter: "blur(5px)",
      },
    },
  },
  Drawer: {
    baseStyle: {
      overlay: {
        backdropFilter: "blur(5px)",
      },
    },
  },
  Text: {
    variants: {
      secondary: {
        color: "textSecondary",
      },
    },
  },
};

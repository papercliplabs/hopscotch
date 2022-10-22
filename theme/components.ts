export const components = {
  Button: {
    baseStyle: {
      borderRadius: "full"
    }
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
      tertiary: {
        color: "textTertiary",
      },
      interactive: {
        color: "textInteractive",
      },
      gradient: {
        background: "gradients.brand",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent"
      }
    },
  },
};

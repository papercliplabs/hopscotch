export const components = {
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
      gradient: {
        background: "gradients.brand",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent"
      }
    },
  },
};

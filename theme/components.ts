const buttonDisabledProps = {
  backgroundColor: "#EFF0F3",
  color: "rgba(27, 29, 31, 0.3)",
  opacity: 1,
};

export const components = {
  Button: {
    baseStyle: {
      borderRadius: "full",
      _active: {
        filter: "brightness(.85)",
        transform: "scale(.98)",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      },
      _disabled: {
        ...buttonDisabledProps,
      },
    },
    variants: {
      primary: {
        backgroundColor: "#0E76FD",
        color: "#FFFFFF",
        _hover: {
          backgroundColor: "#0052D8",
          _disabled: {
            ...buttonDisabledProps,
          },
        },
      },
      secondary: {
        backgroundColor: "#E4F2FF",
        color: "#0D88FF",
        _hover: {
          backgroundColor: "#BFCBD8",
          _disabled: {
            ...buttonDisabledProps,
          },
        },
      },
      critical: {
        backgroundColor: "#FF4949",
        color: "#FFFFFF",
        _hover: {
          backgroundColor: "#D83E32",
          _disabled: {
            ...buttonDisabledProps,
          },
        },
        _disabled: {
          ...buttonDisabledProps,
        },
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
      tertiary: {
        color: "textTertiary",
      },
      interactive: {
        color: "textInteractive",
      },
      gradient: {
        background: "gradients.brand",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
      },
    },
  },
};

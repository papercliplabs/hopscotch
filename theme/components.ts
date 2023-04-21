import { textStyles } from "./typography";
import { alertAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys);

const baseStyle = definePartsStyle({
    icon: {
        color: "positive",
    },
    container: {
        width: "fit-content",
        color: "white",
        bg: "rgba(27, 29, 31, 0.7)",
        py: 3,
        px: 4,
    },
});

export const alertTheme = defineMultiStyleConfig({ baseStyle });

const buttonDisabledProps = {
    backgroundColor: "#EFF0F3",
    color: "rgba(27, 29, 31, 0.3)",
    opacity: 1,
};

export const components = {
    Alert: alertTheme,
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
            ...textStyles.titleLg,
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
                boxShadow:
                    "0px 20px 8px rgba(14, 118, 253, 0.01), 0px 11px 7px rgba(14, 118, 253, 0.03), 0px 5px 5px rgba(14, 118, 253, 0.04), 0px 1px 3px rgba(14, 118, 253, 0.05), 0px 0px 0px rgba(14, 118, 253, 0.05)",
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
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            },
        },
    },
    Spinner: {
        baseStyle: {
            emptyColor: "bgPrimary",
            // style={{
            //     borderTopColor: colors.bgPrimary,
            // }}
            // color: "linear-gradient(135deg, #E013DD 0%, #F41FEC 52.08%, #FF4E82 100%)",
            color: "pink",
            // backgroundColor: "red",
            borderTopColor: "bgPrimary",
        },
        defaultProps: {
            size: "xl",
            speed: "1.45s",
            thickness: "4px",
        },
    },
};

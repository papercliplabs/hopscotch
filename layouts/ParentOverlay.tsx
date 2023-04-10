import { Box, Slide, BoxProps } from "@chakra-ui/react";

interface ParentOverlayProps extends BoxProps {
    isOpen: boolean;
    slideDirection?: "left" | "right" | "top" | "bottom";
    children?: React.ReactNode;
    exitDelaySec?: number;
}

export default function ParentOverlay({ isOpen, slideDirection, children, exitDelaySec }: ParentOverlayProps) {
    return (
        <Slide
            in={isOpen}
            direction={slideDirection}
            style={{
                position: "absolute",
                padding: "inherit",
                width: "100%",
                height: "100%",
                background: "white",
            }}
            unmountOnExit={true}
            delay={{ exit: exitDelaySec ?? 0 }}
        >
            <Box height="100%" width="100%" pointerEvents={isOpen ? "inherit" : "none"}>
                {children}
            </Box>
        </Slide>
    );
}

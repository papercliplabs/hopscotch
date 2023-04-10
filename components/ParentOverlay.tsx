import { Box, Slide, BoxProps } from "@chakra-ui/react";

interface ParentOverlayProps extends BoxProps {
    isOpen: boolean;
    slideDirection?: "left" | "right" | "top" | "bottom";
    children?: React.ReactNode;
}

export default function ParentOverlay({ isOpen, slideDirection, children }: ParentOverlayProps) {
    return (
        <Slide
            in={isOpen}
            direction={slideDirection}
            style={{ position: "absolute", padding: "inherit", width: "100%", height: "100%" }}
            unmountOnExit={true}
        >
            <Box
                position="absolute"
                padding="16px"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={100}
                overflow="hidden"
                bg="rgb(255, 255, 255, 1)"
                borderRadius="md"
                pointerEvents={isOpen ? "inherit" : "none"}
            >
                {children}
            </Box>
        </Slide>
    );
}

import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface PrimaryCardGridProps {
    children: ReactNode;
}

export const PrimaryCard = forwardRef<BoxProps, "div">((props, ref) => {
    return (
        <Box
            backgroundColor="white"
            borderRadius="lg"
            boxShadow="defaultLg"
            height="434px"
            width="100%"
            maxWidth="400px"
            overflow="hidden"
            position="relative"
            alignItems="center"
            justifyContent="space-between"
            flexDirection="column"
            padding={4}
            style={{ WebkitTransform: "translate3d(0, 0, 0)" }}
            ref={ref}
            {...props}
        />
    );
});

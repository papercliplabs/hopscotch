import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function PrimaryCard({ children }: { children: ReactNode }) {
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
        >
            {children}
        </Box>
    );
}

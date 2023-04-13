import { Box } from "@chakra-ui/react";

export default function PrimaryCardView({ children }: { children: React.ReactNode }) {
    return (
        <Box position="absolute" padding="inherit" height="100%" width="100%" top={0} left={0} backgroundColor="white">
            {children}
        </Box>
    );
}

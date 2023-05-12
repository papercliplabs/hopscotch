import { colors } from "@/theme/colors";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Warning } from "@phosphor-icons/react";

export default function WarningDisclaimer() {
    return (
        <Flex
            width="100%"
            backgroundColor="warningAlpha.100"
            color="textSecondary"
            borderRadius="md"
            p={4}
            flexDirection="row"
            direction="row"
            justifyContent="space-between"
            align="top"
            maxWidth="400px"
            gap={4}
        >
            <Box width="32px">
                <Warning size={32} color={colors.warning} weight="fill" />
            </Box>
            <Text textStyle="bodySm">
                This is experimental software, currently in beta. Please be aware that there may be some risks
                associated with using it.
            </Text>
        </Flex>
    );
}

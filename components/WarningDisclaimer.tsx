import { Flex, Text } from "@chakra-ui/react";

export default function WarningDisclaimer() {
    return (
        <Flex
            width="100%"
            backgroundColor="warning"
            color="textSecondary"
            borderRadius="12px"
            p={2}
            flexDirection="row"
            direction="row"
            justifyContent="center"
            align="top"
            maxWidth="400px"
            gap={4}
        >
            <Text textStyle="titleSm">Hopscotch is currently in beta.</Text>
        </Flex>
    );
}

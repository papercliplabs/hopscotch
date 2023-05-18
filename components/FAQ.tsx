import { Flex, Text } from "@chakra-ui/react";

export default function FAQ() {
    return (
        <Flex
            width="100%"
            color="textSecondary"
            borderRadius="12px"
            py="32px"
            flexDirection="row"
            direction="row"
            justifyContent="center"
            align="top"
            maxWidth="400px"
            gap={4}
        >
            <Text
                as="a"
                textStyle="titleMd"
                _hover={{ cursor: "pointer" }}
                href="https://hopscotch-cash.notion.site/Hopscotch-Knowledge-Base-da6ec59000a34751a2e7bdc69cd99854"
                target="_blank"
            >
                How it works
            </Text>
        </Flex>
    );
}

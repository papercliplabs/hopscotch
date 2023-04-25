import { colors } from "@/theme/colors";
import { Flex, Text } from "@chakra-ui/react";
import { CheckCircle } from "@phosphor-icons/react";

interface ToastProps {
    msg: string;
}

export default function Toast({ msg }: ToastProps) {
    return (
        <Flex width="100%" justifyContent="center" alignItems="center">
            <Flex
                backgroundColor="rgba(27, 29, 31, 0.7)"
                boxShadow="defaultMd"
                borderRadius="1000px"
                p={3}
                pr={4}
                mb={3}
                width="fit-content"
                justifyContent="flex-start"
                alignItems="center"
                gap="6px"
            >
                <CheckCircle size={24} weight="fill" color={colors.success} />
                <Text textStyle="titleMd" color="white">
                    {msg}
                </Text>
            </Flex>
        </Flex>
    );
}

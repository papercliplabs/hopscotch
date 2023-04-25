import { Box, Button, Center, Fade, Flex, Text, SlideFade, Slide } from "@chakra-ui/react";
import { ReactElement } from "react";
import Image, { StaticImageData } from "next/image";
import { NumberCircleOne, X, NumberCircleTwo, NumberCircleThree } from "@phosphor-icons/react";

import PrimaryCardView from "@/layouts/PrimaryCardView";
import { colors } from "@/theme/colors";

export interface StepInfoProps {
    icon: ReactElement;
    title: string;
    description: string;
}

function StepInfo({ icon, title, description }: StepInfoProps): ReactElement {
    return (
        <Flex direction="row" width="100%" gap="14px" justifyContent="flex-start">
            <Flex width="40px" height="40px">
                {icon}
            </Flex>
            <Flex direction="column" gap="4px" width="100%" justifyContent="center">
                <Text textStyle="titleMd" justifySelf="center">
                    {title}
                </Text>
                <Text textStyle="bodyMd" variant="secondary" justifySelf="center">
                    {description}
                </Text>
            </Flex>
        </Flex>
    );
}

interface HowItWorksProps {
    closeCallback: () => void;
    stepOneInfo: Omit<StepInfoProps, "icon">;
    stepTwoInfo: Omit<StepInfoProps, "icon">;
    stepThreeInfo: Omit<StepInfoProps, "icon">;
}

export default function HowItWorks({
    closeCallback,
    stepOneInfo,
    stepTwoInfo,
    stepThreeInfo,
}: HowItWorksProps): ReactElement {
    return (
        <PrimaryCardView>
            <Center display="flex" flexDirection="column" height="100%" justifyContent="space-between" gap="30px">
                <Flex justifyContent="space-between" alignItems="center" width="100%">
                    <Box flexBasis={0} flex={1} />
                    <Text textStyle="titleLg" justifySelf="center">
                        How it works
                    </Text>
                    <Flex flexBasis={0} flex={1} justifyContent="flex-end">
                        <Button variant="ghost" onClick={() => closeCallback()} p={0} right={-2}>
                            <X size={24} weight="bold" />
                        </Button>
                    </Flex>
                </Flex>

                <Flex direction="column" gap="4px" width="100%" justifyContent="space-between" flexGrow={1} px="8px">
                    <StepInfo
                        icon={<NumberCircleOne size={32.5} color={colors.primary} />}
                        title={stepOneInfo.title}
                        description={stepOneInfo.description}
                    />
                    <StepInfo
                        icon={<NumberCircleTwo size={32.5} color={colors.primary} />}
                        title={stepTwoInfo.title}
                        description={stepTwoInfo.description}
                    />
                    <StepInfo
                        icon={<NumberCircleThree size={32.5} color={colors.primary} />}
                        title={stepThreeInfo.title}
                        description={stepThreeInfo.description}
                    />
                </Flex>

                <Flex direction="column" width="100%" gap="8px">
                    <Button
                        variant="secondary"
                        type="submit"
                        width="100%"
                        minHeight="48px"
                        size="lg"
                        onClick={() => {
                            closeCallback();
                        }}
                        m={0}
                    >
                        Got it
                    </Button>
                </Flex>
            </Center>
        </PrimaryCardView>
    );
}

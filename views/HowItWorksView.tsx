import { Box, Button, CloseButton, Center, Fade, Flex, Text, SlideFade, Slide } from "@chakra-ui/react";
import { ReactElement } from "react";
import Image from "next/image";

import oneImg from "@/public/static/one.svg";
import twoImg from "@/public/static/two.svg";
import threeImg from "@/public/static/three.svg";
import PrimaryCardView from "@/layouts/PrimaryCardView";

export interface StepInfoProps {
    imgSrc: string;
    title: string;
    description: string;
}

function StepInfo({ imgSrc, title, description }: StepInfoProps): ReactElement {
    return (
        <Flex direction="row" width="100%" gap="14px" justifyContent="flex-start">
            <Image src={imgSrc} alt="step" width={40} height={40} className="rounded-full" />
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

interface HowItWorksViewProps {
    closeCallback: () => void;
    stepOneInfo: Omit<StepInfoProps, "imgSrc">;
    stepTwoInfo: Omit<StepInfoProps, "imgSrc">;
    stepThreeInfo: Omit<StepInfoProps, "imgSrc">;
}

export default function HowItWorksView({
    closeCallback,
    stepOneInfo,
    stepTwoInfo,
    stepThreeInfo,
}: HowItWorksViewProps): ReactElement {
    return (
        <PrimaryCardView>
            <Center display="flex" flexDirection="column" height="100%" justifyContent="space-between" gap="30px">
                <Flex justifyContent="space-between" alignItems="center" width="100%">
                    <Box flexBasis={0} flex={1} />
                    <Text textStyle="titleLg" justifySelf="center">
                        How it works
                    </Text>
                    <Flex flexBasis={0} flex={1} justifyContent="flex-end">
                        <CloseButton onClick={() => closeCallback()} width="40px" height="40px" />
                    </Flex>
                </Flex>

                <Flex direction="column" gap="4px" width="100%" justifyContent="space-between" flexGrow={1} px="8px">
                    <StepInfo imgSrc={oneImg} title={stepOneInfo.title} description={stepOneInfo.description} />
                    <StepInfo imgSrc={twoImg} title={stepTwoInfo.title} description={stepTwoInfo.description} />
                    <StepInfo imgSrc={threeImg} title={stepThreeInfo.title} description={stepThreeInfo.description} />
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

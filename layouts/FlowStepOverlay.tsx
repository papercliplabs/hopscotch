import ParentOverlay from "@/layouts/ParentOverlay";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Fade, Flex, Slide, Text, useTimeout, withDelay } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";

export interface ButtonInfo {
    text: string;
    rightIcon?: ReactElement;
    onClick?: () => void;
}

interface FlowStepOverlayProps {
    isOpen: boolean;
    backButtonCallback?: () => void;
    title?: string;
    icon?: ReactElement;
    subtitle?: string;
    body?: string;
    bodyBold?: string;
    custom?: ReactElement;
    primaryButtonInfo?: ButtonInfo;
    secondaryButtonInfo?: ButtonInfo;
    bottomText?: string;
    slideDirection?: "left" | "right" | "top" | "bottom";
    compressButtons?: boolean;
    exitDelaySec?: number;
}

export default function FlowStepOverlay({
    isOpen,
    backButtonCallback,
    title,
    icon,
    subtitle,
    body,
    bodyBold,
    custom,
    primaryButtonInfo,
    secondaryButtonInfo,
    bottomText,
    slideDirection,
    compressButtons,
    exitDelaySec,
}: FlowStepOverlayProps): ReactElement {
    return (
        <ParentOverlay isOpen={isOpen} slideDirection={slideDirection} exitDelaySec={exitDelaySec}>
            <Center display="flex" flexDirection="column" height="100%" justifyContent="space-between">
                <Flex justifyContent="space-between" alignItems="center" width="100%">
                    <Flex flexBasis={0} flex={1}>
                        {backButtonCallback && (
                            <Button variant="ghost" onClick={() => backButtonCallback()} width="40px" p={0}>
                                <ArrowBackIcon />
                            </Button>
                        )}
                    </Flex>
                    <Text textStyle="titleLg" justifySelf="center">
                        {title}
                    </Text>
                    <Box flexBasis={0} flex={1} />
                </Flex>

                <Flex direction="column" gap="4px" width="100%" justifyContent="center">
                    {icon && (
                        <Flex width="100%" justifyContent="center" pb="8px">
                            {icon}
                        </Flex>
                    )}

                    {subtitle && (
                        <Text textStyle="titleLg" align="center">
                            {subtitle}
                        </Text>
                    )}

                    {body && (
                        <Text textStyle="bodyLg" variant="secondary" align="center">
                            {body}
                        </Text>
                    )}

                    {bodyBold && (
                        <Text textStyle="bodyLg" variant="secondary" fontWeight="bold" align="center">
                            {bodyBold}
                        </Text>
                    )}
                </Flex>

                {custom}
                <Flex direction={compressButtons ? "row-reverse" : "column"} width="100%" gap="8px">
                    {primaryButtonInfo && (
                        <Button
                            variant="primary"
                            type="submit"
                            width="100%"
                            minHeight="48px"
                            size="lg"
                            onClick={() => {
                                primaryButtonInfo.onClick && primaryButtonInfo.onClick();
                            }}
                            isDisabled={primaryButtonInfo.onClick == undefined}
                            rightIcon={primaryButtonInfo.rightIcon}
                        >
                            {primaryButtonInfo.text}
                        </Button>
                    )}

                    {secondaryButtonInfo && (
                        <Button
                            variant="secondary"
                            type="submit"
                            width="100%"
                            minHeight="48px"
                            size="lg"
                            onClick={() => {
                                secondaryButtonInfo.onClick && secondaryButtonInfo.onClick();
                            }}
                            isDisabled={secondaryButtonInfo.onClick == undefined}
                            rightIcon={secondaryButtonInfo.rightIcon}
                            m={0}
                        >
                            {secondaryButtonInfo.text}
                        </Button>
                    )}

                    {bottomText && (
                        <Text textStyle="bodyMd" variant="secondary" align="center">
                            {bottomText}
                        </Text>
                    )}
                </Flex>
            </Center>
        </ParentOverlay>
    );
}

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Fade, Flex, Text } from "@chakra-ui/react";
import { ReactElement } from "react";
import { ParentOverlay } from "./ParentOverlay";

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
}: FlowStepOverlayProps): ReactElement {
    return (
        <Fade in={isOpen}>
            <ParentOverlay p={4} pointerEvents={isOpen ? "inherit" : "none"}>
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
                        <Flex width="100%" justifyContent="center" pb="8px">
                            {icon}
                        </Flex>

                        <Text textStyle="titleLg" align="center">
                            {subtitle}
                        </Text>

                        <Text textStyle="bodyLg" variant="secondary" align="center">
                            {body}
                        </Text>

                        <Text textStyle="bodyLg" variant="secondary" fontWeight="bold" align="center">
                            {bodyBold}
                        </Text>
                    </Flex>

                    <Flex direction="column" width="100%" gap="8px">
                        {custom}

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
        </Fade>
    );
}

// /* <FlowStepOverlay
//                     isOpen={true}
//                     backButtonCallback={() => console.log("back")}
//                     title="test"
//                     icon={
//                         <Spinner
//                             thickness="8px"
//                             speed="1.0s"
//                             emptyColor="bgPrimary"
//                             color="textInteractive"
//                             boxSize="60px"
//                             style={{
//                                 borderTopColor: colors.bgPrimary,
//                             }}
//                         />
//                     }
//                     subtitle="subtitle"
//                     body="body"
//                     bodyBold="bodyBold"
//                     primaryButtonInfo={{
//                         text: "test",
//                         rightIcon: <Image src={CopyIcon} alt="copy" />,
//                         onClick: () => console.log("button_1_click"),
//                     }}
//                     secondaryButtonInfo={{ text: "test", onClick: () => console.log("button_1_click") }}
//                     bottomText="bottom_text"
//                 /> */
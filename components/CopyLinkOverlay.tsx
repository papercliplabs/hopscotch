import { openLink } from "@/common/utils";
import { ReactElement, useEffect, useMemo, useState } from "react";
import FlowStepOverlay from "./FlowStepOverlay";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";
import { Box, Text, useToast, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { BigNumber } from "@ethersproject/bignumber";

interface CopyLinkOverlayProps {
    isOpen: boolean;
    requestSummary?: string;
    requestId?: BigNumber;
    chainId?: number;
    transactionLink?: string;
}

function LinkBox({ link }: { link: string }) {
    return (
        <Link passHref href={link}>
            <Box
                bg="bgSecondary"
                borderRadius="sm"
                py={4}
                px={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
            >
                <Text
                    textStyle="bodyMd"
                    variant="secondary"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                >
                    {link}
                </Text>
            </Box>
        </Link>
    );
}

export default function CopyLinkOverlay({
    isOpen,
    requestSummary,
    requestId,
    chainId,
    transactionLink,
}: CopyLinkOverlayProps): ReactElement {
    const toast = useToast();

    const [requestLink, setRequestLink] = useState<string>("");

    // get url server side safe nextjs
    useEffect(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const path = `/request/${chainId}/${requestId}`;
        setRequestLink(`${origin}${path}`);
    }, [chainId, requestId, setRequestLink]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestLink);

        // show toast notification
        toast({
            title: "Link copied!",
            duration: 5000,
            status: "success",
            position: "bottom",
            variant: "subtle",
        });
    };

    const custom = useMemo(() => {
        return (
            <Flex direction="column" justifyContent="space-between" width="100%" flexGrow={1} py="10px">
                <Button
                    variant="secondary"
                    type="submit"
                    size="sm"
                    mx="auto"
                    px="20px"
                    mt="5px"
                    onClick={() => openLink(transactionLink, true)}
                    rightIcon={<Image src={ArrowSquareOutIcon} alt="copy" />}
                >
                    View on Explorer
                </Button>
                <LinkBox link={requestLink} />
            </Flex>
        );
    }, [requestLink, transactionLink]);

    return (
        <FlowStepOverlay
            isOpen={isOpen}
            icon={
                <Box mt="20px">
                    <Image src={circleCheckImage} alt="check" />
                </Box>
            }
            subtitle={`Your request link was created for ${requestSummary}.`}
            custom={custom}
            primaryButtonInfo={{
                text: "Copy Link",
                onClick: () => {
                    copyToClipboard();
                },
            }}
            bottomText="Copy the link and share it with anyone."
        />
    );
}

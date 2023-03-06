import { openLink } from "@/common/utils";
import { ReactElement, useEffect, useMemo, useState } from "react";
import FlowStepOverlay from "./FlowStepOverlay";
import circleCheckImage from "@/public/static/CircleCheck.svg";
import Image from "next/image";
import ArrowSquareOutIcon from "@/public/static/ArrowSquareOut.svg";
import { Box, Text, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { BigNumber } from "ethers";

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

    return (
        <FlowStepOverlay
            isOpen={isOpen}
            icon={<Image src={circleCheckImage} alt="check" />}
            subtitle="All set!"
            body="Your payment request link was created for"
            bodyBold={requestSummary}
            custom={<LinkBox link={requestLink} />}
            primaryButtonInfo={{
                text: "Copy Link",
                onClick: () => {
                    copyToClipboard();
                },
            }}
            secondaryButtonInfo={{
                text: "View transaction",
                onClick: () => openLink(transactionLink, true),
                rightIcon: <Image src={ArrowSquareOutIcon} alt="copy" />,
            }}
            bottomText="Copy the link and share it with anyone."
        />
    );
}

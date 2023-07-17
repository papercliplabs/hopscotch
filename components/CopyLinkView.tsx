import { openLink } from "@/common/utils";
import { ReactElement, useEffect, useMemo, useState } from "react";
import FlowStepView from "@/layouts/FlowStepView";
import Image from "next/image";
import { Box, Text, useToast, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { ArrowSquareOut, CheckCircle } from "@phosphor-icons/react";
import { colors } from "@/theme/colors";
import Toast from "@/components/Toast";

interface CopyLinkViewProps {
    requestSummary?: string;
    requestId?: bigint;
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

export default function CopyLinkView({
    requestSummary,
    requestId,
    chainId,
    transactionLink,
}: CopyLinkViewProps): ReactElement {
    const toast = useToast();

    const [requestLink, setRequestLink] = useState<string>("");

    // get url server side safe nextjs
    useEffect(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const path = `/r/${chainId}/${requestId}`;
        setRequestLink(`${origin}${path}`);
    }, [chainId, requestId, setRequestLink]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(requestLink);

        // show toast notification
        toast({
            duration: 5000,
            position: "bottom",
            render: () => <Toast msg="Link Copied!" />,
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
                    rightIcon={<ArrowSquareOut size={16} weight="bold" />}
                >
                    View on Explorer
                </Button>
                <LinkBox link={requestLink} />
            </Flex>
        );
    }, [requestLink, transactionLink]);

    return (
        <FlowStepView
            icon={
                <Box mt="47px">
                    <CheckCircle size={70} weight="fill" color={colors.success} />
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

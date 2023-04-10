import { Flex, Text } from "@chakra-ui/react";
import { ReactElement } from "react";

interface SummaryTableEntry {
    title: string;
    titleIcon?: ReactElement;
    value?: string;
    valueIcon?: ReactElement;
}

interface SummaryTableProps {
    entries: SummaryTableEntry[];
    rowGap?: string;
}

export default function SummaryTable({ entries, rowGap }: SummaryTableProps) {
    return (
        <Flex direction="column" width="100%" gap={rowGap}>
            {entries.map((entry, i) => {
                return (
                    <Flex direction="row" justifyContent="space-between" key={i}>
                        <Flex align="center">
                            <Text textStyle="label" variant="secondary">
                                {entry.title}
                            </Text>
                            {entry.titleIcon}
                        </Flex>
                        <Flex align="center">
                            {entry.valueIcon}
                            <Text pl="4px" textStyle="label" variant="primary">
                                {entry.value}
                            </Text>
                        </Flex>
                    </Flex>
                );
            })}
        </Flex>
    );
}

import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface PrimaryCardGridProps {
  children: ReactNode;
}

export const PrimaryCard = forwardRef<BoxProps, "div">((props, ref) => {
  return (
    <Box
      backgroundColor="white"
      borderRadius="lg"
      boxShadow="defaultLg"
      minHeight="434px"
      width="400px"
      ref={ref}
      {...props}
    />
  );
});

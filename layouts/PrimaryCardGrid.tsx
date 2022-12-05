import { FC, ReactNode } from "react";
import { Box, BoxProps, Grid, GridProps, forwardRef } from "@chakra-ui/react";

const HEIGHT = "434px";
const MAX_HEGIHT = "540px";

export interface PrimaryCardGridProps {
  children: ReactNode;
}

export const PrimaryCard = forwardRef<BoxProps, "div">((props, ref) => {
  return (
    <Box
      backgroundColor="white"
      borderRadius="lg"
      boxShadow="defaultLg"
      minHeight={HEIGHT}
      maxWidth="400px"
      width="100%"
      ref={ref}
      {...props}
    />
  );
});

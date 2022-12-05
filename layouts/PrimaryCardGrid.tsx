import { FC, ReactNode } from "react";
import { Box, BoxProps, Grid, GridProps, forwardRef } from "@chakra-ui/react";

import { useNestedPortalRef } from "@/components/NestedPortal";

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
      maxWidth="400px"
      width="100%"
      // height={HEIGHT}
      ref={ref}
      {...props}
    />
  );
});



export const PrimaryCardGrid: FC<GridProps> = (props) => {
  const containerRef = useNestedPortalRef();
  return (
    <Grid
      templateColumns="1fr"
      backgroundColor="white"
      maxWidth="400px"
      height={HEIGHT}
      width="100%"
      minH={0}
      boxShadow="defaultLg"
      borderRadius="lg"
      templateRows={`minmax(${HEIGHT}, ${MAX_HEGIHT}) minmax(${HEIGHT}, ${MAX_HEGIHT})`}
      overflow="hidden"
      ref={containerRef}
      {...props}
    />
  );
};

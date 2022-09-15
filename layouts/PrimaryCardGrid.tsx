import { FC, ReactNode } from "react";
import { Grid } from "@chakra-ui/react"

import { useNestedPortalRef } from "@/components/NestedPortal";

const HEIGHT = "45vh";
const MAX_HEGIHT = "494px";

export interface PrimaryCardGridProps {
  children: ReactNode;
}

export const PrimaryCardGrid: FC<PrimaryCardGridProps> = (props) => {
  const { children } = props;
  const containerRef = useNestedPortalRef();
 return (
    <Grid
      templateColumns="1fr"
      backgroundColor="white"
      maxWidth="456px"
      height={HEIGHT}
      width="100%"
      minH={0}
      boxShadow='dark-lg'
      borderRadius="3xl"
      templateRows={`minmax(${HEIGHT}, ${MAX_HEGIHT}) minmax(${HEIGHT}, ${MAX_HEGIHT})`}
      overflow="hidden"
      ref={containerRef}
      >
        {children}
      </Grid>
 )
};

import {
  Box,
  BoxProps
} from "@chakra-ui/react";
import { FC } from "react";

export const ParentOverlay: FC<BoxProps> = (props) => (
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    zIndex={100}
    overflow="hidden"
    bg="rgb(255, 255, 255, 1)"
    borderRadius="md"
    {...props}
  />
);
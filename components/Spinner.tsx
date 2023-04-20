import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import SpinnerLarge from "@/public/static/SpinnerL.svg";

interface SpinnerProps {
    size: string;
}

export default function Spinner({ size }: SpinnerProps) {
    return (
        <AnimatePresence initial={true}>
            <motion.img
                src={SpinnerLarge.src}
                width={size}
                height={size}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    type: "linear",
                    ease: "linear",
                    repeatDelay: 0,
                }}
            />
        </AnimatePresence>
    );
}

import { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@chakra-ui/react";

interface CarouselProps {
    views: ReactElement[];
    activeViewIndex: number;
}

export default function Carousel({ views, activeViewIndex }: CarouselProps) {
    const [lastActiveViewIndex, setLastActiveViewIndex] = useState(0);

    const index = useMemo(() => {
        return Math.max(Math.min(parseInt(activeViewIndex.toString()), views.length), 0);
    }, [activeViewIndex, views]);

    useEffect(() => {
        setLastActiveViewIndex(index);
    }, [index]);

    const direction = index > lastActiveViewIndex ? 1 : -1;

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? "100%" : "-100%",
                opacity: 1,
            };
        },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => {
            return {
                x: direction > 0 ? "-100%" : "100%",
                opacity: 1,
            };
        },
    };

    return (
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
                style={{
                    position: "absolute",
                    padding: "inherit",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "linear", duration: 0.4 }}
                key={index}
            >
                {views[index]}
            </motion.div>
        </AnimatePresence>
    );
}

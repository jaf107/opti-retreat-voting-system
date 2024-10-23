import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface RevealAnimationProps {
  isRevealing: boolean;
  onRevealComplete: () => void;
  categoryId: string;
}

const MotionBox = motion(Box as any);

const gifs = [
  "/gifs/gif_1.gif",
  "/gifs/gif_2.gif",
  "/gifs/gif_3.gif",
  "/gifs/gif_4.gif",
  "/gifs/gif_5.gif",
];

export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  isRevealing,
  onRevealComplete,
  categoryId,
}) => {
  const [currentGif, setCurrentGif] = useState("");

  useEffect(() => {
    if (isRevealing) {
      const gifIndex = parseInt(categoryId, 36) % gifs.length;
      setCurrentGif(gifs[gifIndex]);

      const timer = setTimeout(() => {
        onRevealComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isRevealing, onRevealComplete, categoryId]);

  return (
    <AnimatePresence>
      {isRevealing && (
        <MotionBox
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(0, 0, 0, 0.8)"
          zIndex="9999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box
            as="img"
            src={currentGif}
            alt="Revealing winner"
            // width="100%"
            height="100%"
            objectFit="contain"
            objectPosition="center"
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface RevealAnimationProps {
  isRevealing: boolean;
  onRevealComplete: () => void;
}

const MotionBox = motion(Box as any);

export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  isRevealing,
  onRevealComplete,
}) => {
  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        onRevealComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isRevealing, onRevealComplete]);

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
            src="https://y.yarn.co/080d55fe-0992-4137-81be-2ff44858fa48_text.gif"
            alt="Revealing winner"
            maxWidth="100%"
            maxHeight="100%"
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

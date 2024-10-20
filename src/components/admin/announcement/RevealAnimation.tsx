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
  "https://y.yarn.co/080d55fe-0992-4137-81be-2ff44858fa48_text.gif",
  "https://media1.tenor.com/m/fdRr2I1IwF8AAAAC/and-the-winner-is-benedict-townsend.gif",
  "https://media1.tenor.com/m/kbLnwaNWXcsAAAAC/drum-roll-please-miranda-payne.gif",
  "https://media1.tenor.com/m/kiq_TodItEYAAAAC/drumroll-exciting.gif",
  "https://media1.tenor.com/m/izMMHOSq_w4AAAAd/winner-hereyougo.gif",
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

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, SimpleGrid, Container, Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import { useAnnouncementState } from "../hooks/useAnnouncementState";

import { ChoiceCard } from "./ChoiceCard";
import { WinnerCard } from "./WinnerCard";
import { AnnouncementControls } from "./admin/announcement/AnnouncementControls";
import { RevealAnimation } from "./RevealAnimation";
import Fireworks from "@fireworks-js/react";

export const WinnerAnnouncement: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();
  const [isRevealing, setIsRevealing] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const { showWinner, setShowWinner, winnerChoice } =
    useAnnouncementState(category);

  if (isLoading || !category) {
    return <Box>Loading...</Box>;
  }

  const handleNext = () => {
    setShowFireworks(false);
    const currentIndex = categories.findIndex((c) => c.id === categoryId);
    if (currentIndex < categories.length - 1) {
      navigate(`/announce/${categories[currentIndex + 1].id}`);
      setShowWinner(false);
    } else {
      navigate("/adios");
    }
  };

  const handleShowWinner = () => {
    setIsRevealing(true);
  };

  const handleRevealComplete = () => {
    setIsRevealing(false);
    setShowWinner(true);
    setShowFireworks(true);
  };

  const sortedChoices = [...category.choices].sort((a, b) => {
    if (showWinner) {
      return b.vote_count - a.vote_count;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const visibleChoices = sortedChoices.filter((choice) =>
    showWinner ? choice.id !== winnerChoice?.id : !choice.hidden
  );

  return (
    <>
      {showFireworks && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100vh"
          zIndex={0}
        >
          <Fireworks
            options={{
              rocketsPoint: {
                min: 50,
                max: 100,
              },
              intensity: 50,
              explosion: 5,
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </Box>
      )}

      <Box position="relative" minHeight="100vh" zIndex={1}>
        <Container maxW="full" centerContent>
          <Heading as="h1" size="xl" textAlign="center">
            {category.name}
          </Heading>

          <Flex
            height={"85vh"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <AnimatePresence mode="wait">
              {showWinner && winnerChoice && (
                <Box width={"400px"}>
                  <WinnerCard choice={winnerChoice} />
                </Box>
              )}
            </AnimatePresence>

            <Flex gap={10} px={4} width="100%" alignItems={"center"}>
              <AnimatePresence mode="wait">
                {visibleChoices.map((choice) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    showResults={showWinner}
                  />
                ))}
              </AnimatePresence>
            </Flex>
          </Flex>
        </Container>

        <AnnouncementControls
          showWinner={showWinner}
          onShowWinner={handleShowWinner}
          onNext={handleNext}
          isLastCategory={
            categories.indexOf(category) === categories.length - 1
          }
        />

        <RevealAnimation
          isRevealing={isRevealing}
          onRevealComplete={handleRevealComplete}
          categoryId={categoryId ?? ""}
        />
      </Box>
    </>
  );
};

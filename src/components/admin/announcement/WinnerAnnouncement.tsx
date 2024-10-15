import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, SimpleGrid, Container } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCategories } from "../../../hooks/useCategories";
import { useAnnouncementState } from "../../../hooks/useAnnouncementState";

import { ChoiceCard } from "./ChoiceCard";
import { WinnerCard } from "./WinnerCard";
import { AnnouncementControls } from "./AnnouncementControls";

export const WinnerAnnouncement: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();

  const category = categories.find((c) => c.id === categoryId);
  const { showWinner, setShowWinner, winnerChoice } =
    useAnnouncementState(category);

  if (isLoading || !category) {
    return <Box>Loading...</Box>;
  }

  const handleNext = () => {
    const currentIndex = categories.findIndex((c) => c.id === categoryId);
    if (currentIndex < categories.length - 1) {
      navigate(`/admin/announce/${categories[currentIndex + 1].id}`);
      setShowWinner(false);
    } else {
      navigate("/admin/results");
    }
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
    <Box position="relative" minHeight="100vh" pb="120px">
      <Container maxW="xl" centerContent>
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          {category.name}
        </Heading>

        <AnimatePresence mode="wait">
          {showWinner && winnerChoice && <WinnerCard choice={winnerChoice} />}
        </AnimatePresence>

        <SimpleGrid
          columns={
            !showWinner
              ? {
                  base: 2,
                }
              : {
                  base: 2,
                  lg: visibleChoices.length,
                }
          }
          spacing={4}
          px={4}
          width="100%"
        >
          <AnimatePresence mode="wait">
            {visibleChoices.map((choice) => (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                showResults={showWinner}
              />
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </Container>

      <AnnouncementControls
        showWinner={showWinner}
        onShowWinner={() => setShowWinner(true)}
        onNext={handleNext}
        isLastCategory={categories.indexOf(category) === categories.length - 1}
      />
    </Box>
  );
};

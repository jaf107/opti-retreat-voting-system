import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Category from "./Category";
import { useVotingState } from "../hooks/useVotingState";
import { useNextCategory } from "../hooks/useNextCategory";
import { useCategoryData } from "../hooks/useCategoryData";

export default function VotingFlow() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("Session context is not available");
  }
  const { sessionId } = session;

  // Custom hooks
  const { category, choices } = useCategoryData(categoryId);
  const {
    selectedChoiceId,
    setSelectedChoiceId,
    hasVoted,
    handleVoteSubmission,
  } = useVotingState(categoryId, sessionId || "");
  const { nextCategoryId, nextCategoryStatus } = useNextCategory(categoryId);

  const handleNext = () => {
    if (nextCategoryId) {
      navigate(`/vote/${nextCategoryId}`);
    } else {
      navigate("/");
    }
  };

  if (!category) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box position="relative" minHeight="100vh" pb="120px">
      <Container maxW="xl" centerContent>
        <Heading as="h2" size="xl" mb={4} textAlign="center">
          {category?.name}
        </Heading>

        <AnimatePresence mode="wait">
          <SimpleGrid columns={2} spacing={4} px={4} width="100%">
            {choices.map((choice) => (
              <Category
                key={choice.id}
                choice={choice}
                isSelected={selectedChoiceId === choice.id}
                onSelect={setSelectedChoiceId}
                isDisabled={hasVoted}
              />
            ))}
          </SimpleGrid>
        </AnimatePresence>
      </Container>
      <VotingControls
        selectedChoiceId={selectedChoiceId}
        hasVoted={hasVoted}
        nextCategoryStatus={nextCategoryStatus}
        nextCategoryId={nextCategoryId}
        onSubmit={handleVoteSubmission}
        onNext={handleNext}
      />
    </Box>
  );
}

interface VotingControlsProps {
  selectedChoiceId: string | null;
  hasVoted: boolean;
  nextCategoryStatus: boolean;
  nextCategoryId: string | null;
  onSubmit: () => void;
  onNext: () => void;
}

function VotingControls({
  selectedChoiceId,
  hasVoted,
  nextCategoryStatus,
  nextCategoryId,
  onSubmit,
  onNext,
}: VotingControlsProps) {
  return (
    <Flex
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      justifyContent="space-between"
      alignItems="center"
      p={4}
      bg="white"
      boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
      zIndex={10}
    >
      <Box style={{ color: "white" }}>Placeholder</Box>
      <Button
        onClick={onSubmit}
        colorScheme="blue"
        isDisabled={!selectedChoiceId || hasVoted}
        size="sm"
      >
        Submit Vote
      </Button>
      <Button
        onClick={onNext}
        isDisabled={!nextCategoryStatus && !!nextCategoryId}
        rightIcon={<ChevronRightIcon />}
        variant="outline"
        size="sm"
      >
        {nextCategoryId ? "Next" : "Finish"}
      </Button>
    </Flex>
  );
}

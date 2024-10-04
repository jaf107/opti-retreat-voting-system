import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import { updateVote } from "../utils/supabaseApi";
import { fetchChoices } from "../utils/controllers/Choices";
import { submitVote, checkIfUserHasVoted } from "../utils/controllers/Votes";
import {
  fetchCategory,
  getNextCategory,
} from "../utils/controllers/Categories";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  useToast,
  Container,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Category as CategoryType } from "../models/Category";
import { Choice } from "../models/Choice";
import Category from "./Category";

const VotingFlow: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [votedChoiceId, setVotedChoiceId] = useState<string | null>(null);
  const [nextCategoryId, setNextCategoryId] = useState<string | null>(null);
  const [nextCategoryStatus, setNextCategoryStatus] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("Session context is not available");
  }
  const { sessionId, hasVoted, setHasVoted } = session;

  const loadCategory = useCallback(async () => {
    if (categoryId) {
      const { data, error } = await fetchCategory(categoryId);
      if (error) {
        console.error("Error fetching category:", error);
        toast({
          title: "Error loading category",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        setCategory(data);
      }
    }
  }, [categoryId, toast]);

  const loadChoices = useCallback(async () => {
    if (categoryId) {
      const { data, error } = await fetchChoices(categoryId);
      if (error) {
        console.error("Error fetching choices:", error);
        toast({
          title: "Error loading choices",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        setChoices(data || []);
      }
      checkIfVoted(categoryId);
    }
  }, [categoryId, toast]);

  const loadNextCategory = useCallback(async () => {
    if (categoryId) {
      const { data: nextCategory } = await getNextCategory(categoryId);
      setNextCategoryStatus(nextCategory?.status || false);
      setNextCategoryId(nextCategory?.id || null);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategory();
    loadChoices();
    loadNextCategory();

    const intervalId = setInterval(loadNextCategory, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [loadCategory, loadChoices, loadNextCategory]);

  const checkIfVoted = async (categoryId: string) => {
    const { data, error } = await checkIfUserHasVoted(
      sessionId || "",
      categoryId
    );
    if (!error && data?.length !== undefined && data.length > 0) {
      setHasVoted(true);
      setSelectedChoiceId(data[0].choice_id);
      setVotedChoiceId(data[0].choice_id);
    } else {
      setHasVoted(false);
      setSelectedChoiceId(null);
      setVotedChoiceId(null);
    }
  };

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
  };

  const handleSubmit = async () => {
    if (!selectedChoiceId) {
      toast({
        title: "Please select an option",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    let error;
    if (hasVoted) {
      if (selectedChoiceId !== votedChoiceId) {
        ({ error } = await updateVote(
          sessionId || "",
          categoryId || "",
          selectedChoiceId
        ));
      } else {
        return;
      }
    } else {
      ({ error } = await submitVote(
        sessionId || "",
        categoryId || "",
        selectedChoiceId
      ));
    }

    if (!error) {
      toast({
        title: hasVoted
          ? "Vote updated successfully"
          : "Vote submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setHasVoted(true);
      setVotedChoiceId(selectedChoiceId);
    } else {
      toast({
        title: hasVoted ? "Error updating vote" : "Error submitting vote",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

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
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          {category?.name}
        </Heading>
        <AnimatePresence mode="wait">
          <SimpleGrid columns={2} spacing={4} px={4} width="100%">
            {choices.map((choice) => (
              <Category
                key={choice.id}
                choice={choice}
                isSelected={selectedChoiceId === choice.id}
                onSelect={handleSelectChoice}
              />
            ))}
          </SimpleGrid>
        </AnimatePresence>
      </Container>
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
        <Box style={{ color: "white" }}>Heddsllo</Box>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          isDisabled={
            !selectedChoiceId ||
            (hasVoted && selectedChoiceId === votedChoiceId)
          }
          size="sm"
        >
          {hasVoted ? "Update Vote" : "Submit Vote"}
        </Button>
        <Button
          onClick={handleNext}
          isDisabled={!nextCategoryStatus && !!nextCategoryId}
          rightIcon={<ChevronRightIcon />}
          variant="outline"
          size="sm"
        >
          {nextCategoryId ? "Next" : "Finish"}
        </Button>
      </Flex>
    </Box>
  );
};

export default VotingFlow;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../App";
import {
  fetchCategories,
  fetchPollOptions,
  submitVote,
  checkIfUserHasVoted,
  updateVote,
} from "../utils/supabaseApi";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  useToast,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";
import { useSwipeable, SwipeableHandlers } from "react-swipeable";

type Category = {
  id: string;
  name: string;
};

type Option = {
  id: string;
  name: string;
  image_url: string;
};

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

const VotingFlow: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("Session context is not available");
  }
  const { sessionId, hasVoted, setHasVoted } = session;

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await fetchCategories();
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadOptionsForCurrentCategory();
    }
  }, [categories, currentCategoryIndex]);

  const loadOptionsForCurrentCategory = async () => {
    const currentCategory = categories[currentCategoryIndex];
    if (currentCategory) {
      const { data, error } = await fetchPollOptions(currentCategory.id);
      if (error) {
        console.error("Error fetching options:", error);
      } else {
        setOptions(data || []);
      }
      checkIfVoted(currentCategory.id);
    }
  };

  const checkIfVoted = async (categoryId: string) => {
    const { data, error } = await checkIfUserHasVoted(
      sessionId || "",
      categoryId
    );
    if (!error && data?.length !== undefined && data.length > 0) {
      setHasVoted(true);
      setSelectedOptionId(data[0].option_id);
    } else {
      setHasVoted(false);
      setSelectedOptionId(null);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    const currentCategory = categories[currentCategoryIndex];
    if (hasVoted && selectedOptionId !== optionId) {
      // Update the vote
      const { error } = await updateVote(
        sessionId || "",
        currentCategory.id,
        optionId
      );
      if (error) {
        toast({
          title: "Error updating vote",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setSelectedOptionId(optionId);
        toast({
          title: "Vote updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } else if (!hasVoted) {
      setSelectedOptionId(optionId);
    }
  };

  const handleVote = async () => {
    if (!selectedOptionId) {
      toast({
        title: "Please select an option",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const currentCategory = categories[currentCategoryIndex];
    const { error } = await submitVote(
      sessionId || "",
      currentCategory.id,
      selectedOptionId
    );
    if (!error) {
      toast({
        title: "Vote submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setHasVoted(true);
    } else {
      toast({
        title: "Error submitting vote",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const goToPreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const goToNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () => goToNextCategory(),
    onSwipedRight: () => goToPreviousCategory(),
    trackMouse: true,
  });

  return (
    <Box {...handlers}>
      <Heading as="h2" size="lg" mb={4}>
        {categories[currentCategoryIndex]?.name || "Loading..."}
      </Heading>
      <AnimatePresence mode="wait">
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={4}
          key={currentCategoryIndex}
        >
          {options.map((option) => (
            <MotionBox
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              // transition={{ duration: 0.3 }}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleSelectOption(option.id)}
              bg={selectedOptionId === option.id ? "blue.100" : "white"}
              boxShadow={
                selectedOptionId === option.id
                  ? "0 0 0 3px rgba(66, 153, 225, 0.6)"
                  : "none"
              }
            >
              <Box position="relative" pb="100%">
                <Image
                  src={option.image_url}
                  alt={option.name}
                  objectFit="cover"
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box p={4}>
                <Heading as="h3" size="md" mb={2}>
                  {option.name}
                </Heading>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(option.id);
                  }}
                  colorScheme={selectedOptionId === option.id ? "blue" : "gray"}
                  width="100%"
                >
                  {hasVoted && selectedOptionId === option.id
                    ? "Selected"
                    : "Select"}
                </Button>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </AnimatePresence>
      <Flex justifyContent="space-between" mt={4}>
        <Button
          onClick={goToPreviousCategory}
          disabled={currentCategoryIndex === 0}
        >
          Previous
        </Button>
        {hasVoted ? (
          <Button onClick={goToNextCategory} colorScheme="blue">
            Next
          </Button>
        ) : (
          <Button
            onClick={handleVote}
            colorScheme="green"
            disabled={!selectedOptionId}
          >
            Vote
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default VotingFlow;

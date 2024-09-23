import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import {
  fetchCategory,
  fetchPollOptions,
  submitVote,
  checkIfUserHasVoted,
  updateVote,
  getNextCategory,
  getPreviousCategory,
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
  Text,
} from "@chakra-ui/react";
import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [nextCategoryId, setNextCategoryId] = useState<string | null>(null);
  const [previousCategoryId, setPreviousCategoryId] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const toast = useToast();

  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("Session context is not available");
  }
  const { sessionId, hasVoted, setHasVoted } = session;

  useEffect(() => {
    const loadCategory = async () => {
      if (categoryId) {
        const { data, error } = await fetchCategory(categoryId);
        if (error) {
          console.error("Error fetching category:", error);
        } else {
          setCategory(data);
        }
      }
    };
    loadCategory();
  }, [categoryId]);

  useEffect(() => {
    const loadOptions = async () => {
      if (categoryId) {
        const { data, error } = await fetchPollOptions(categoryId);
        if (error) {
          console.error("Error fetching options:", error);
        } else {
          setOptions(data || []);
        }
        checkIfVoted(categoryId);
      }
    };
    loadOptions();
  }, [categoryId]);

  useEffect(() => {
    const loadAdjacentCategories = async () => {
      if (categoryId) {
        const { data: nextCategory } = await getNextCategory(categoryId);
        const { data: previousCategory } = await getPreviousCategory(
          categoryId
        );
        setNextCategoryId(nextCategory?.id || null);
        setPreviousCategoryId(previousCategory?.id || null);
      }
    };
    loadAdjacentCategories();
  }, [categoryId]);

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
    if (hasVoted && selectedOptionId !== optionId) {
      // Update the vote
      const { error } = await updateVote(
        sessionId || "",
        categoryId || "",
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

    const { error } = await submitVote(
      sessionId || "",
      categoryId || "",
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

  const handleNext = () => {
    if (nextCategoryId) {
      navigate(`/vote/${nextCategoryId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (previousCategoryId) {
      navigate(`/vote/${previousCategoryId}`);
    } else {
      navigate("/");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: true,
  });

  if (!category) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box {...handlers} position="relative" height="100vh">
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        {category.name}
      </Heading>
      <Flex
        position="absolute"
        left="0"
        right="0"
        top="50%"
        transform="translateY(-50%)"
        justifyContent="space-between"
        px={4}
        zIndex={10}
      >
        <Button
          onClick={handlePrevious}
          disabled={!previousCategoryId}
          leftIcon={<ChevronLeftIcon />}
        >
          Prev
        </Button>
        <Button onClick={handleNext} rightIcon={<ChevronRightIcon />}>
          {nextCategoryId ? "Next" : "Finish"}
        </Button>
      </Flex>
      <AnimatePresence mode="wait">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} px={4}>
          {options.map((option) => (
            <MotionBox
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
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
      <Flex justifyContent="center" mt={4}>
        {!hasVoted && (
          <Button
            onClick={handleVote}
            colorScheme="green"
            disabled={!selectedOptionId}
          >
            Vote
          </Button>
        )}
        {hasVoted && (
          <Text fontSize="lg" fontWeight="bold" color="green.500">
            Vote submitted!
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default VotingFlow;

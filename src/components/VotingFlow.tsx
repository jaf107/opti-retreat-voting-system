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
  Text,
  VStack,
  chakra,
  Container,
  Badge,
} from "@chakra-ui/react";
import { motion, AnimatePresence, isValidMotionProp } from "framer-motion";
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
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
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
      setVotedOptionId(data[0].option_id);
    } else {
      setHasVoted(false);
      setSelectedOptionId(null);
      setVotedOptionId(null);
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOptionId) {
      toast({
        title: "Please select an option",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let error;
    if (hasVoted) {
      if (selectedOptionId !== votedOptionId) {
        ({ error } = await updateVote(
          sessionId || "",
          categoryId || "",
          selectedOptionId
        ));
      } else {
        return;
      }
    } else {
      ({ error } = await submitVote(
        sessionId || "",
        categoryId || "",
        selectedOptionId
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
      });
      setHasVoted(true);
      setVotedOptionId(selectedOptionId);
    } else {
      toast({
        title: hasVoted ? "Error updating vote" : "Error submitting vote",
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
      navigate("/");
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
    <Box {...handlers} position="relative" minHeight="100vh" pb="120px">
      <Container maxW="4xl" centerContent>
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          {category?.name}
        </Heading>
        <AnimatePresence mode="wait">
          <SimpleGrid columns={2} spacing={4} px={4}>
            {options.map((option) => (
              <MotionBox
                key={option.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <Box
                  borderWidth="1px"
                  borderRadius="xl"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => handleSelectOption(option.id)}
                  bg={selectedOptionId === option.id ? "blue.50" : "white"}
                  boxShadow={
                    selectedOptionId === option.id
                      ? "0 0 0 3px rgba(66, 153, 225, 0.6)"
                      : "lg"
                  }
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)" }}
                  height="100%"
                  display="flex"
                  flexDirection="column"
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
                  <VStack p={4} align="start" spacing={2} flex="1">
                    <Heading as="h3" size="sm">
                      {option.name}
                    </Heading>
                    <Badge
                      colorScheme={
                        selectedOptionId === option.id ? "blue" : "gray"
                      }
                      variant={
                        selectedOptionId === option.id ? "solid" : "subtle"
                      }
                      fontSize="xs"
                    >
                      {selectedOptionId === option.id
                        ? "Selected"
                        : "Click to select"}
                    </Badge>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </AnimatePresence>
      </Container>
      <Flex
        position="fixed"
        bottom="70px"
        left="0"
        right="0"
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg="white"
        boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
        zIndex={10}
      >
        <Button
          onClick={handlePrevious}
          disabled={!previousCategoryId}
          leftIcon={<ChevronLeftIcon />}
          variant="outline"
          size="sm"
        >
          Prev
        </Button>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          isDisabled={
            !selectedOptionId ||
            (hasVoted && selectedOptionId === votedOptionId)
          }
          size="sm"
        >
          {hasVoted ? "Update Vote" : "Submit Vote"}
        </Button>
        <Button
          onClick={handleNext}
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

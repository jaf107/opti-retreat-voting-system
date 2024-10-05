import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  useToast,
  Tooltip,
  BoxProps,
} from "@chakra-ui/react";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import {
  fetchCategories,
  fetchChoicesWithVotes,
} from "../../utils/supabaseApi";
import { Category, CategoryWithChoices } from "../../models/Category";
import { ChoiceWithVotes } from "../../models/Choice";

// Create a custom MotionBox component
const MotionBox = motion<BoxProps>(Box as any);

const AnnouncementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithChoices[]>([]);
  const [showWinners, setShowWinners] = useState<{ [key: string]: boolean }>(
    {}
  );
  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } =
        await fetchCategories();
      if (categoriesError) throw categoriesError;
      if (!categoriesData) throw new Error("No categories data received");

      const categoriesWithChoices: CategoryWithChoices[] = await Promise.all(
        categoriesData.map(async (category: Category) => {
          const { data: choicesData, error: choicesError } =
            await fetchChoicesWithVotes(category.id);
          if (choicesError) throw choicesError;
          if (!choicesData)
            throw new Error(
              `No choices data received for category ${category.id}`
            );

          const totalVotes = choicesData.reduce(
            (sum: number, choice: ChoiceWithVotes) => sum + choice.voteCount,
            0
          );
          const choicesWithPercentage = choicesData.map(
            (choice: ChoiceWithVotes) => ({
              ...choice,
              votePercentage:
                totalVotes > 0 ? (choice.voteCount / totalVotes) * 100 : 0,
            })
          );

          const sortedChoices = choicesWithPercentage.sort(
            (a: { voteCount: number }, b: { voteCount: number }) =>
              b.voteCount - a.voteCount
          );
          const winner = sortedChoices[0] || null;

          return {
            ...category,
            choices: sortedChoices,
            winner,
            totalVotes,
          };
        })
      );

      setCategories(categoriesWithChoices);
    } catch (error) {
      toast({
        title: "Error loading categories and choices",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleShowWinner = (categoryId: string) => {
    setShowWinners((prev) => ({ ...prev, [categoryId]: true }));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Announce Winners
      </Heading>
      <VStack spacing={8}>
        {categories.map((category) => (
          <Box
            key={category.id}
            w="100%"
            borderWidth={1}
            borderRadius="lg"
            p={6}
          >
            <Heading as="h2" size="lg" mb={4}>
              {category.name}
            </Heading>
            <AnimatePresence>
              {showWinners[category.id] && category.winner && (
                <Box
                  mb={6}
                  p={4}
                  borderWidth={2}
                  borderRadius="md"
                  borderColor="green.500"
                  bg="green.50"
                >
                  <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heading as="h3" size="md" mb={2}>
                      Winner
                    </Heading>
                    <Text fontWeight="bold">{category.winner.name}</Text>
                    <Text>
                      {category.winner.votePercentage.toFixed(2)}% of votes
                    </Text>
                  </MotionBox>
                </Box>
              )}
            </AnimatePresence>
            {!showWinners[category.id] && (
              <Button
                colorScheme="blue"
                onClick={() => handleShowWinner(category.id)}
                mb={4}
              >
                Show Winner
              </Button>
            )}
            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
              {category.choices.map((choice) => (
                <Tooltip
                  key={choice.id}
                  label={`${choice.votePercentage.toFixed(2)}% of votes`}
                  aria-label={`${
                    choice.name
                  } received ${choice.votePercentage.toFixed(2)}% of votes`}
                  hasArrow
                  placement="top"
                  bg="gray.700"
                  color="white"
                >
                  <Box
                    borderWidth={1}
                    borderRadius="md"
                    p={3}
                    textAlign="center"
                    bg={
                      category.winner?.id === choice.id ? "yellow.100" : "white"
                    }
                    position="relative"
                    overflow="hidden"
                    _hover={{
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <Text>{choice.name}</Text>
                  </Box>
                </Tooltip>
              ))}
            </SimpleGrid>
            <Text mt={4} fontSize="sm" color="gray.600">
              Total votes: {category.totalVotes}
            </Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default AnnouncementPage;

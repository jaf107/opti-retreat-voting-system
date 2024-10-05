import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Container,
  Text,
  useToast,
  AspectRatio,
  Image,
  VStack,
  HStack,
  Progress,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  fetchCategories,
  fetchChoicesWithVotes,
} from "../../utils/supabaseApi";
import { Category, CategoryWithChoices } from "../../models/Category";
import { ChoiceWithVotes } from "../../models/Choice";
import { useAnnouncementState } from "../../hooks/useAnnouncementState";

const MotionBox = motion(Box as any);

const AnnouncementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithChoices[]>([]);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [otherChoiceSize, setOtherChoiceSize] = useState<number>(0);
  const toast = useToast();

  const currentCategory = categories[currentCategoryIndex];

  const { showWinner, setShowWinner, winnerChoice } =
    useAnnouncementState(currentCategory);

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
            (sum: number, choice: ChoiceWithVotes) => sum + choice.vote_count,
            0
          );
          const choicesWithPercentage = choicesData.map(
            (choice: ChoiceWithVotes) => ({
              ...choice,
              votePercentage:
                totalVotes > 0 ? (choice.vote_count / totalVotes) * 100 : 0,
            })
          );

          const sortedChoices = choicesWithPercentage.sort(
            (a: { voteCount: number }, b: { voteCount: number }) =>
              b.voteCount - a.voteCount
          );
          const winner = sortedChoices[0] || null;
          setOtherChoiceSize(choicesData.length - 1);
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
        position: "top",
      });
    }
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setShowWinner(false);
    } else {
      toast({
        title: "All categories announced",
        description: "You've reached the end of all categories.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (!currentCategory) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box position="relative" minHeight="100vh" pb="120px">
      <Container maxW="xl" centerContent>
        <Heading as="h2" size="xl" mb={8} textAlign="center">
          {currentCategory.name}
        </Heading>
        <AnimatePresence mode="wait">
          {showWinner && winnerChoice && (
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              width="100%"
              mb={8}
            >
              <Box
                borderWidth="2px"
                borderRadius="xl"
                overflow="hidden"
                bg="green.50"
                borderColor="green.700"
                boxShadow="xl"
                p={4}
              >
                <VStack spacing={4} align="stretch">
                  <Heading as="h3" size="lg" textAlign="center">
                    Winner
                  </Heading>
                  <AspectRatio ratio={16 / 9} width="100%">
                    <Image
                      src={winnerChoice.image_src}
                      alt={winnerChoice.name}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <Text fontSize="xl" fontWeight="bold" textAlign="center">
                    {winnerChoice.name}
                  </Text>
                  <HStack justify="space-between">
                    <Text fontSize="lg">
                      {winnerChoice.votePercentage.toFixed(2)}% of votes
                    </Text>
                    <Text fontSize="lg">{winnerChoice.vote_count} votes</Text>
                  </HStack>
                  <Progress
                    value={winnerChoice.votePercentage}
                    colorScheme="green"
                    size="lg"
                  />
                </VStack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
        <SimpleGrid
          columns={showWinner ? otherChoiceSize : 2}
          spacing={4}
          px={4}
          width="100%"
        >
          {currentCategory.choices
            .filter((choice) => !showWinner || choice.id !== winnerChoice?.id)
            .map((choice) => (
              <MotionBox
                key={choice.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                width="100%"
              >
                <Box
                  borderWidth="1px"
                  borderRadius="xl"
                  overflow="hidden"
                  bg="white"
                  boxShadow="md"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)" }}
                  height="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <AspectRatio ratio={1} width="100%">
                    <Image
                      src={choice.image_src}
                      alt={choice.name}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <VStack p={2} spacing={2} align="stretch">
                    <Text fontWeight="bold" fontSize="sm">
                      {choice.name}
                    </Text>
                    {showWinner && (
                      <>
                        <Text fontSize="xs" color="gray.600">
                          {choice.votePercentage.toFixed(2)}% (
                          {choice.vote_count} votes)
                        </Text>
                        <Progress
                          value={choice.votePercentage}
                          size="sm"
                          colorScheme="blue"
                        />
                      </>
                    )}
                  </VStack>
                </Box>
              </MotionBox>
            ))}
        </SimpleGrid>
      </Container>
      <AnnouncementControls
        showWinner={showWinner}
        onShowWinner={() => setShowWinner(true)}
        onNext={handleNext}
        isLastCategory={currentCategoryIndex === categories.length - 1}
      />
    </Box>
  );
};

interface AnnouncementControlsProps {
  showWinner: boolean;
  onShowWinner: () => void;
  onNext: () => void;
  isLastCategory: boolean;
}

const AnnouncementControls: React.FC<AnnouncementControlsProps> = ({
  showWinner,
  onShowWinner,
  onNext,
  isLastCategory,
}) => (
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
    {!showWinner && (
      <Button onClick={onShowWinner} colorScheme="blue" size="sm">
        Show Winner
      </Button>
    )}
    <Button
      onClick={onNext}
      rightIcon={<ChevronRightIcon />}
      variant="outline"
      size="sm"
      isDisabled={!showWinner}
    >
      {isLastCategory ? "Finish" : "Next Category"}
    </Button>
  </Flex>
);

export default AnnouncementPage;

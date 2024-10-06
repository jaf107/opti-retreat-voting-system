import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Container,
  Text,
  AspectRatio,
  Image,
  VStack,
  HStack,
  Progress,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useCategories } from "../../hooks/useCategories";
import { useAnnouncementState } from "../../hooks/useAnnouncementState";
import { ChoiceWithVotes } from "../../models/Choice";

const MotionBox = motion(Box as any);

interface ChoiceCardProps {
  choice: ChoiceWithVotes;
  showResults: boolean;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ choice, showResults }) => (
  <MotionBox
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
        <Image src={choice.image_src} alt={choice.name} objectFit="cover" />
      </AspectRatio>
      <VStack p={2} spacing={2} align="stretch">
        <Text fontWeight="bold" fontSize="sm">
          {choice.name}
        </Text>
        {showResults && (
          <>
            <Text fontSize="xs" color="gray.600">
              {choice.votePercentage.toFixed(2)}% ({choice.vote_count} votes)
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
);

interface WinnerCardProps {
  choice: ChoiceWithVotes;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ choice }) => (
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
          <Image src={choice.image_src} alt={choice.name} objectFit="cover" />
        </AspectRatio>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {choice.name}
        </Text>
        <HStack justify="space-between">
          <Text fontSize="lg">
            {choice.votePercentage.toFixed(2)}% of votes
          </Text>
          <Text fontSize="lg">{choice.vote_count} votes</Text>
        </HStack>
        <Progress value={choice.votePercentage} colorScheme="green" size="lg" />
      </VStack>
    </Box>
  </MotionBox>
);

export const CategoryAnnouncement: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();

  const category = categories.find((c) => c.id === categoryId);
  const { showWinner, setShowWinner, winnerChoice } =
    useAnnouncementState(category);
  const otherChoiceSize = category ? category.choices.length - 1 : 0;

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
          columns={showWinner ? (otherChoiceSize % 2 === 0 ? 2 : 3) : 2}
          spacing={4}
          px={4}
          width="100%"
        >
          <AnimatePresence mode="wait">
            {category.choices
              .filter((choice) => !showWinner || choice.id !== winnerChoice?.id)
              .map((choice) => (
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
    <Button
      isDisabled={showWinner}
      onClick={onShowWinner}
      colorScheme="blue"
      size="sm"
    >
      Show Winner
    </Button>
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

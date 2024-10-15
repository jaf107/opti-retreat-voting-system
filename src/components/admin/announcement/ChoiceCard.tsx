import {
  AspectRatio,
  Box,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChoiceWithVotes } from "../../../models/Choice";

interface ChoiceCardProps {
  choice: ChoiceWithVotes;
  showResults: boolean;
}

const MotionBox = motion(Box as any);

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  showResults,
}) => (
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

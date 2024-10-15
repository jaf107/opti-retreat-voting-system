import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChoiceWithVotes } from "../../../models/Choice";

const MotionBox = motion(Box as any);

interface WinnerCardProps {
  choice: ChoiceWithVotes;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ choice }) => (
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

import {
  AspectRatio,
  Box,
  Flex,
  Heading,
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
    <Flex
      flexDirection={"column"}
      borderWidth="2px"
      borderRadius="xl"
      overflow="hidden"
      bg="green.50"
      borderColor="green.700"
      boxShadow="xl"
      p={4}
      gap={2}
    >
      <Heading as="h3" size="lg" textAlign="center">
        Winner
      </Heading>
      <AspectRatio ratio={4 / 3} width="100%">
        <Image
          src={choice.image_src}
          alt={choice.name}
          height={"full"}
          borderRadius={"lg"}
        />
      </AspectRatio>
      <Text fontSize="xl" fontWeight="bold" textAlign="center">
        {choice.name}
      </Text>
      <Text fontSize="lg" textAlign={"center"}>
        {choice.votePercentage.toFixed(2)}% of votes
      </Text>
      <Progress value={choice.votePercentage} colorScheme="green" size="lg" />
    </Flex>
  </MotionBox>
);

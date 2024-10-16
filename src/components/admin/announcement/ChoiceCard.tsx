import React from "react";
import {
  AspectRatio,
  Box,
  Flex,
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
      <AspectRatio ratio={4 / 3} width="100%">
        <Image src={choice.image_src} alt={choice.name} objectFit="cover" />
      </AspectRatio>

      <Flex direction="column" flex={1} p={2}>
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold" fontSize="sm" textAlign="center">
            {choice.name}
          </Text>
        </Box>

        {showResults && (
          <VStack spacing={1} mt="auto">
            <Text fontSize="xs" textAlign="center">
              {choice.votePercentage.toFixed(2)}% of votes
            </Text>
            <Progress
              value={choice.votePercentage}
              colorScheme="blue"
              size="sm"
              width="100%"
            />
          </VStack>
        )}
      </Flex>
    </Box>
  </MotionBox>
);

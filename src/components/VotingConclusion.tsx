import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box as any);

export default function VotingConclusion() {
  const navigate = useNavigate();

  return (
    <Container maxW="xl" centerContent>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
        py={10}
      >
        <VStack spacing={6}>
          <Heading as="h1" size="2xl" mb={2}>
            Thank You for Voting!
          </Heading>
          <Text fontSize="xl" mb={4}>
            Your voice has been heard. The results will be announced soon.
          </Text>
        </VStack>
      </MotionBox>
    </Container>
  );
}

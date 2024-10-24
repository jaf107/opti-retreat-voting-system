import React from "react";
import { Box, Heading, Text, VStack, Container } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box as any);

export default function AnnouncementConclusion() {
  return (
    <Container maxW="xl" centerContent>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
        py={10}
      >
        <VStack spacing={8}>
          <Heading as="h1" size="2xl" mb={4}>
            Thank You for Joining Us
          </Heading>
          <Text fontSize="lg" mb={6}>
            Thank you all for being part of the Optimizely Retreat 2024! We hope
            you had the chance to connect with colleagues, recharge, and gain
            new inspiration for the exciting work ahead. Safe travels home, and
            here’s to an amazing year ahead!
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            Until next time!
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            Meet the team: Sabbir Bhai, Jafar, Toha
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Don't forget to send Bonusly points!☀️🥲
          </Text>
        </VStack>
      </MotionBox>
    </Container>
  );
}

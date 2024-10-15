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
            Thank you all for being part of the Optimizely Retreat 2024! As we
            wrap up this incredible experience, we hope you’ve had the chance to
            connect with colleagues, recharge, and gain new inspiration for the
            exciting work ahead. Your enthusiasm and participation are what made
            this retreat truly special, and we couldn’t be more grateful to have
            such a dedicated and vibrant team. Let’s take the energy and
            camaraderie from this event back with us, and continue building on
            the collaboration and innovation that make Optimizely thrive. Safe
            travels home, and here’s to an amazing year ahead!
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            We look forward to seeing the amazing things you'll accomplish in
            the coming year. Until next time!
          </Text>
        </VStack>
      </MotionBox>
    </Container>
  );
}

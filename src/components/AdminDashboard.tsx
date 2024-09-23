import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getAppStatus, toggleAppStatus } from "../utils/supabaseApi";

const AdminDashboard: React.FC = () => {
  const [isVotingEnabled, setIsVotingEnabled] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    checkVotingStatus();
  }, []);

  useEffect(() => {
    checkVotingStatus();
  }, []);

  const checkVotingStatus = async () => {
    try {
      const { data, error } = await getAppStatus();
      if (error) throw error;
      setIsVotingEnabled(!!data?.is_running);
    } catch (error) {
      toast({
        title: "Error checking voting status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleVoting = async () => {
    try {
      const { data, error } = await toggleAppStatus();
      if (error) throw error;
      setIsVotingEnabled(data || false);
      toast({
        title: `Voting ${data ? "enabled" : "disabled"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error toggling voting status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="2xl" mb={8}>
        Admin Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Voting Status</Heading>
            <Text>
              Current status: {isVotingEnabled ? "Enabled" : "Disabled"}
            </Text>
            <Button
              colorScheme={isVotingEnabled ? "red" : "green"}
              onClick={toggleVoting}
            >
              {isVotingEnabled ? "Stop Voting" : "Start Voting"}
            </Button>
          </VStack>
        </Box>
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Results Dashboard</Heading>
            <Button as={Link} to="/results" colorScheme="blue">
              View Results
            </Button>
          </VStack>
        </Box>
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Manage Categories</Heading>
            <Button as={Link} to="/categories" colorScheme="blue">
              Manage Categories
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default AdminDashboard;

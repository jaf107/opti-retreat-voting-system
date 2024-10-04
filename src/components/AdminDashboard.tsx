import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getAppStatus, toggleAppStatus } from "../utils/controllers/AppStatus";
import CategoryManagement from "./CategoryManagement";

const AdminDashboard: React.FC = () => {
  const [isVotingEnabled, setIsVotingEnabled] = useState<boolean>(false);
  const toast = useToast();

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
        position: "top",
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
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error toggling voting status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading as="h1" size="xl" mb={8}>
          Admin Dashboard
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="100%">
          <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
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
          <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Quick Links</Heading>
              <Button as={Link} to="/admin/categories" colorScheme="blue">
                Categories
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

export default AdminDashboard;

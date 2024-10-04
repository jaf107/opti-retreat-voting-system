import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Text,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { getAppStatus } from "../utils/controllers/AppStatus";
import { fetchFirstCategory } from "../utils/controllers/Categories";
import { FaAward } from "react-icons/fa";

const Homepage: React.FC = () => {
  const [appStatus, setAppStatus] = useState<boolean | null>(null);
  const [firstCategoryId, setFirstCategoryId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppStatus();
    loadFirstCategory();
  }, []);

  const loadAppStatus = async () => {
    try {
      const { data, error } = await getAppStatus();
      if (error) {
        throw new Error("Error fetching app status");
      }
      const isRunning = data?.is_running ?? false;
      setAppStatus(isRunning);
    } catch (error) {
      setAppStatus(false);
      console.error("Error loading app status:", error);
    }
  };

  const loadFirstCategory = async () => {
    try {
      const { data, error } = await fetchFirstCategory();
      if (error) {
        throw new Error("Error fetching first category");
      }
      setFirstCategoryId(data?.id || null);
    } catch (error) {
      console.error("Error loading first category:", error);
    }
  };

  const handleStart = () => {
    if (firstCategoryId) {
      navigate(`/vote/${firstCategoryId}`);
    } else {
      console.error("No categories available");
    }
  };

  if (appStatus === null) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  if (!appStatus) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card width="350px">
          <CardHeader>Voting is currently closed</CardHeader>
          <CardBody>
            <Text>Please check back later when voting is enabled.</Text>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      p={8}
      borderRadius="lg"
      boxShadow="md"
      bg="gray.50"
      alignItems="center"
      justifyContent="center"
    >
      <VStack alignItems={"center"} spacing={8}>
        <Flex as="h1" mb={6} alignItems="center" justifyContent="center">
          <Box py={12} textAlign="center">
            <Flex alignItems="center" justifyContent="center" gap={2}>
              <FaAward size={32} className="mr-2" />
              <Heading as="h2" size="2xl">
                Categories
              </Heading>
            </Flex>
            <Text m={4} fontSize="xl">
              Welcome to the UnOptimized Awards 2024!
            </Text>
          </Box>
        </Flex>
        <Button
          onClick={handleStart}
          colorScheme="blue"
          size="lg"
          leftIcon={<FaAward />}
          isDisabled={!firstCategoryId}
        >
          Start Voting
        </Button>
        <Text>Click the button above to start voting.</Text>
      </VStack>
    </Box>
  );
};

export default Homepage;

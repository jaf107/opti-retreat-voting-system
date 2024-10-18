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
  Image,
  AspectRatio,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react";
import { getAppStatus } from "../utils/controllers/AppStatus";
import { fetchFirstCategory } from "../utils/controllers/Categories";
import { FaAward } from "react-icons/fa";

const Homepage: React.FC = () => {
  const [appStatus, setAppStatus] = useState<boolean | null>(null);
  const [firstCategoryId, setFirstCategoryId] = useState<string | null>(null);
  const [firstCategoryStatus, setFirstCategoryStatus] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const textSize = useBreakpointValue({ base: "md", md: "lg" });

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
      setFirstCategoryStatus(data?.status || false);
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

  const SunsetImage = () => (
    <AspectRatio ratio={1} width="100%" maxWidth="650px" margin="auto">
      <Image src="/sunset_shadow.png" objectFit="cover" />
    </AspectRatio>
  );

  const Content = () => {
    if (appStatus === null) {
      return (
        <Flex direction="column" align="center" justify="center" height="100vh">
          <SunsetImage />
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            mt={4}
          />
        </Flex>
      );
    }

    if (!appStatus) {
      return (
        <VStack spacing={4} align="center">
          <SunsetImage />
          <Card width="auto">
            <CardHeader>Voting is currently closed</CardHeader>
            <CardBody>
              <Text>Please check back later when voting is enabled.</Text>
            </CardBody>
          </Card>
        </VStack>
      );
    }

    return (
      <Container maxW="container.md" py={[8, 12, 16]}>
        <VStack spacing={[6, 8, 10]} align="center">
          <SunsetImage />
          <Box textAlign="center">
            <Heading as="h2" size={headingSize} mb={4}>
              Welcome to the UnOptimized Awards 2024!
            </Heading>
          </Box>
          <Button
            onClick={handleStart}
            colorScheme="orange"
            borderRadius="full"
            leftIcon={<FaAward />}
            isDisabled={!firstCategoryStatus}
            fontSize={["lg", "xl"]}
            size={buttonSize}
            w="full"
            h={["14", "16", "20"]}
          >
            Start Voting
          </Button>
          <Text textAlign="center" fontSize={textSize}>
            Click the button above to start voting.
          </Text>
        </VStack>
      </Container>
    );
  };

  return (
    <Box
      p={8}
      borderRadius="lg"
      boxShadow="md"
      bg="gray.50"
      minHeight="100vh"
      display="flex"
      alignItems="start"
      justifyContent="center"
    >
      <Content />
    </Box>
  );
};

export default Homepage;

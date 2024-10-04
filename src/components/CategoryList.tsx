import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  Flex,
} from "@chakra-ui/react";
import { fetchCategories } from "../utils/controllers/Categories";
import { getAppStatus } from "../utils/controllers/AppStatus";
import { FaAward } from "react-icons/fa";
import { Category } from "../models/Category";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [appStatus, setAppStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await fetchCategories();
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data || []);
      }
    };
    loadCategories();
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
    }
  };

  useEffect(() => {
    loadAppStatus();
  }, []);

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
    <Box p={8} borderRadius={"lg"} boxShadow="md" bg="gray.50">
      <Flex as="h1" mb={6} alignItems="center" justifyContent="center">
        <Box py={12} textAlign="center">
          <Flex alignItems="center" justifyContent="center" gap={2}>
            <FaAward size={32} className="mr-2" />
            <Heading as="h2" size="2xl">
              Categories
            </Heading>
          </Flex>
          <Text mt={4} fontSize="lg">
            Explore our award categories and cast your votes!
          </Text>
        </Box>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {categories.map((category) => (
          <Link key={category.id} to={`/vote/${category.id}`}>
            <Button
              border={"1px"}
              borderColor={"gray.400"}
              size="lg"
              width="100%"
              height="100px"
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryList;

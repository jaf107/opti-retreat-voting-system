import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { fetchCategories, getAppStatus } from "../utils/supabaseApi";

type Category = {
  id: string;
  name: string;
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  const [appStatus, setAppStatus] = useState<boolean | null>(null);

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
    <Box>
      <Heading as="h1" size="xl" mb={6} textAlign={"center"}>
        UnOptimized Awards Ceremony
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {categories.map((category) => (
          <Link key={category.id} to={`/vote/${category.id}`}>
            <Button size="lg" width="100%" height="100px">
              {category.name}
            </Button>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryList;

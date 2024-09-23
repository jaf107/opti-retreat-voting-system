import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../utils/supabaseApi";
import { SessionContext } from "../App";
import { Box, Button, Heading, Text, Spinner, VStack } from "@chakra-ui/react";

type Category = {
  id: string;
  name: string;
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const sessionContext = useContext(SessionContext);
  const sessionId = sessionContext?.sessionId;

  const loadCategories = async () => {
    const { data, error } = await fetchCategories();
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleStartBingo = () => {
    navigate("/voting");
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        UnOptimized Awards 2024
      </Heading>

      {loading ? (
        <Spinner />
      ) : categories.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Button colorScheme="blue" onClick={handleStartBingo}>
            Start Voting
          </Button>
          <Heading as="h2" size="lg" mb={4}>
            Categories
          </Heading>
          {categories.map((category) => (
            <Box
              key={category.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
            >
              <Heading fontSize="xl">{category.name}</Heading>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No categories found.</Text>
      )}
    </Box>
  );
};

export default CategoryList;

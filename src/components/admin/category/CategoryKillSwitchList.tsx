import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Switch,
  useToast,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import {
  fetchCategories,
  updateCategoryStatus,
} from "../../../utils/controllers/Categories";
import { Category } from "../../../models/Category";

const CategoryKillSwitchList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await fetchCategories();
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Error loading categories",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = async (
    categoryId: string,
    newStatus: boolean
  ) => {
    try {
      const { error } = await updateCategoryStatus(categoryId, newStatus);
      if (error) throw error;
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, status: newStatus } : cat
        )
      );
      toast({
        title: `Category ${newStatus ? "enabled" : "disabled"}`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error updating category status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Heading as="h2" size="lg" mb={4}>
        Category Management
      </Heading>
      <SimpleGrid columns={{ base: 1 }} spacing={6}>
        {categories.map((category) => (
          <Box
            key={category.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Flex flexDirection={"row"} justifyContent={"space-between"}>
              <Text fontWeight="bold">{category.name}</Text>
              <Switch
                isChecked={category.status}
                onChange={(e) =>
                  handleToggleCategory(category.id, e.target.checked)
                }
                colorScheme="green"
              >
                {category.status ? "Enabled" : "Disabled"}
              </Switch>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryKillSwitchList;

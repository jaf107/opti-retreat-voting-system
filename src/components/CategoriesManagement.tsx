import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";

interface Category {
  id: number;
  name: string;
}

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error fetching categories",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategory }),
        headers: { "Content-Type": "application/json" },
      });
      setNewCategory("");
      fetchCategories();
      toast({
        title: "Category added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateCategory = async (id: number, name: string) => {
    try {
      await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });
      fetchCategories();
      toast({
        title: "Category updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
      toast({
        title: "Category deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="2xl" mb={8}>
        Manage Categories
      </Heading>
      <Box mb={8}>
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          mr={4}
        />
        <Button colorScheme="green" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {categories.map((category) => (
          <Box key={category.id} p={6} borderWidth={1} borderRadius="lg">
            <VStack spacing={4} align="stretch">
              <Input
                defaultValue={category.name}
                onBlur={(e) =>
                  handleUpdateCategory(category.id, e.target.value)
                }
              />
              <Button
                colorScheme="red"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default CategoriesManagement;

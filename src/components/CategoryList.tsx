import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";
import { fetchCategories } from "../utils/supabaseApi";

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

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Bingo Categories
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

import { Box, Button, Heading, SimpleGrid } from "@chakra-ui/react";
import { useCategories } from "../../../hooks/useCategories";
import { Category } from "../../../models/Category";
import { Link } from "react-router-dom";

const AnnouncementList: React.FC = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <SimpleGrid columns={{ base: 1 }} spacing={4} width="100%">
      <Heading size="lg" mb={4}>
        Select Category to Announce
      </Heading>
      {categories.map((category: Category) => (
        <Button
          key={category.id}
          as={Link}
          to={`/admin/announce/${category.id}`}
          size="lg"
          variant="outline"
          justifyContent="flex-start"
          px={6}
          py={8}
        >
          {category.name}
        </Button>
      ))}
    </SimpleGrid>
  );
};

export default AnnouncementList;

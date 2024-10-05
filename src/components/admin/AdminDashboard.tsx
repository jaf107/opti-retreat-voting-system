import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, Route, Routes } from "react-router-dom";
import { useAdminStatus } from "../../hooks/useAdminStatus";
import CategoryManagement from "./CategoryManagement";
import { CategoryAnnouncement } from "./CategoryAnnouncement";
import { Category } from "../../models/Category";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../hooks/useAuth";
import { AuthModal } from "../AuthModel";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, children }) => (
  <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
    <VStack spacing={4} align="stretch">
      <Heading size="md">{title}</Heading>
      {children}
    </VStack>
  </Box>
);

const AdminNavigation: React.FC = () => (
  <Flex width="100%" mb={8} justifyContent="center">
    <Button as={Link} to="/admin" mr={4}>
      Home
    </Button>
    <Button as={Link} to="/admin/categories" mr={4}>
      Categories
    </Button>
    <Button as={Link} to="/admin/announce">
      Announcement
    </Button>
  </Flex>
);

const AdminHome: React.FC = () => {
  const { isVotingEnabled, toggleVoting } = useAdminStatus();

  return (
    <SimpleGrid columns={{ base: 1 }} spacing={8} width="100%">
      <AdminCard title="Voting Status">
        <Text>Current status: {isVotingEnabled ? "Enabled" : "Disabled"}</Text>
        <Button
          colorScheme={isVotingEnabled ? "red" : "green"}
          onClick={toggleVoting}
        >
          {isVotingEnabled ? "Stop Voting" : "Start Voting"}
        </Button>
      </AdminCard>

      <AdminCard title="Category Management">
        <Button as={Link} to="/admin/categories" colorScheme="blue">
          Manage Categories
        </Button>
      </AdminCard>

      <AdminCard title="Announcement">
        <Button as={Link} to="/admin/announce" colorScheme="blue">
          Start Announcements
        </Button>
      </AdminCard>
    </SimpleGrid>
  );
};

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAuthModalOpen, authenticate, logout } = useAuth();

  if (!isAuthenticated) {
    return <AuthModal isOpen={isAuthModalOpen} onAuthenticate={authenticate} />;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading as="h1" size="xl" mb={8}>
          Admin Dashboard
        </Heading>
        <Flex width="100%" justifyContent="flex-end" mb={4}>
          <Button colorScheme="red" onClick={logout}>
            Logout
          </Button>
        </Flex>
        <AdminNavigation />
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/announce" element={<AnnouncementCategoriesList />} />
          <Route
            path="/announce/:categoryId"
            element={<CategoryAnnouncement />}
          />
        </Routes>
      </Flex>
    </Container>
  );
};
const AnnouncementCategoriesList: React.FC = () => {
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

export default AdminDashboard;

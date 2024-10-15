import React from "react";
import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { AuthModal } from "../AuthModal";
import { AdminNavigation } from "./AdminNavigation";
import { AdminRoutes } from "./AdminRoutes";

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
          <Button colorScheme="red" aria-label="Logout" onClick={logout}>
            Logout
          </Button>
        </Flex>
        <AdminNavigation />
        <AdminRoutes />
      </Flex>
    </Container>
  );
};

export default AdminDashboard;

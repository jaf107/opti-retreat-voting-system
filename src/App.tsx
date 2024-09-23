import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ChakraProvider, Box, Flex, Button, VStack } from "@chakra-ui/react";
import { SessionProvider } from "./contexts/SessionContext";
import useSession from "./hooks/useSession";

// Components
import CategoryList from "./components/CategoryList";
import VotingFlow from "./components/VotingFlow";
import ResultsDashboard from "./components/ResultsDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CategoriesManagement from "./components/CategoriesManagement";

export default function App() {
  const session = useSession();

  return (
    <ChakraProvider>
      <SessionProvider value={session}>
        <Router>
          <Box minHeight="100vh" bg="gray.100" p={4}>
            <Flex as="nav" mb={4}>
              <Link to="/">
                <Button variant="outline" mr={2}>
                  Bingo
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" mr={2}>
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            </Flex>
            <VStack spacing={4} align="stretch">
              <Routes>
                <Route path="/" element={<CategoryList />} />
                <Route path="/vote/:categoryId" element={<VotingFlow />} />
                <Route path="/dashboard" element={<ResultsDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                  path="/admin/categories"
                  element={<CategoriesManagement />}
                />
              </Routes>
            </VStack>
          </Box>
        </Router>
      </SessionProvider>
    </ChakraProvider>
  );
}

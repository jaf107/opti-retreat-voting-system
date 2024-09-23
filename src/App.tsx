import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Text,
} from "@chakra-ui/react";
import { SessionProvider } from "./contexts/SessionContext";
import useSession from "./hooks/useSession";

// Components
import CategoryList from "./components/CategoryList";
import VotingFlow from "./components/VotingFlow";
import ResultsDashboard from "./components/ResultsDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CategoriesManagement from "./components/CategoriesManagement";
import { getAppStatus } from "./utils/supabaseApi";

export default function App() {
  const session = useSession();
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
    return <Box>Loading...</Box>;
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

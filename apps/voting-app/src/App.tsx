import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  VStack,
  Card,
  CardHeader,
} from "@chakra-ui/react";
import useSession from "./hooks/useSession";

// Components
import CategoryList from "./components/CategoryList";
import VotingFlow from "./components/VotingFlow";
import Dashboard from "./components/ResultsDashboard";
import { getAppStatus } from "./utils/supabaseApi";

// Types
export type Category = {
  id: string;
  name: string;
};

export type Option = {
  id: string;
  name: string;
  image_url: string;
};

export type Vote = {
  categoryId: string;
  optionId: string;
};

// Create SessionContext
export const SessionContext = createContext<ReturnType<
  typeof useSession
> | null>(null);

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
    return <div>Loading...</div>;
  }

  if (!appStatus) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[350px]">
          <CardHeader>Voting is currently closed</CardHeader>
          <p>Please check back later when voting is enabled.</p>
        </Card>
      </div>
    );
  }
  return (
    <ChakraProvider>
      <SessionContext.Provider value={session}>
        <Router>
          <Box minHeight="100vh" bg="gray.100" p={4}>
            <Flex as="nav" mb={4}>
              <Link to="/">
                <Button variant="outline" mr={2}>
                  Bingo
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </Flex>
            <VStack spacing={4} align="stretch">
              <Routes>
                <Route path="/" element={<CategoryList />} />
                <Route path="/bingo" element={<VotingFlow />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </VStack>
          </Box>
        </Router>
      </SessionContext.Provider>
    </ChakraProvider>
  );
}

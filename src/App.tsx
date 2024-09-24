import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  VStack,
  Image,
  Center,
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

export default function App() {
  const session = useSession();

  return (
    <ChakraProvider>
      <SessionProvider value={session}>
        <Router>
          <Box minHeight="100vh" bg="gray.100" p={4}>
            <Flex as="nav" mb={4} alignItems="center">
              <Box flex="1">
                <Link to={"/"}>
                  <Image src="/optimizely-logo.png" height="40px" />
                </Link>
              </Box>

              <Center flex="2">
                <Link to="/">
                  <Button variant="outline" mx={2}>
                    Awards
                  </Button>
                </Link>
                <Link to="/result">
                  <Button variant="outline" mx={2}>
                    Results
                  </Button>
                </Link>
              </Center>
              <Box flex="1" />
            </Flex>
            <VStack
              spacing={4}
              align="stretch"
              style={{
                height: "95vh",
              }}
            >
              <Routes>
                <Route path="/" element={<CategoryList />} />
                <Route path="/vote/:categoryId" element={<VotingFlow />} />
                <Route path="/result" element={<ResultsDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* 
                // Not supported yet
                <Route
                  path="/admin/categories"
                  element={<CategoriesManagement />} 
                /> */}
              </Routes>
            </VStack>
          </Box>
        </Router>
      </SessionProvider>
    </ChakraProvider>
  );
}

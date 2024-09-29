import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Image,
  Text,
  Heading,
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
          <Flex flexDirection="column" minHeight="100vh">
            <Flex as="nav" p={4} alignItems="center" bg="white" boxShadow="sm">
              <Box flex="1">
                <Link to="/">
                  <Image
                    src="/optimizely-logo.png"
                    height="40px"
                    alt="Optimizely Logo"
                  />
                </Link>
              </Box>
            </Flex>
            <Box flex="1" overflowY="auto" p={4} bg="gray.100">
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
            </Box>
            <Flex
              as="footer"
              justifyContent="center"
              p={4}
              bg="white"
              boxShadow="0 -1px 6px rgba(0,0,0,0.1)"
              position="sticky"
              bottom="0"
              left="0"
              right="0"
              zIndex="sticky"
            >
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
            </Flex>
          </Flex>
        </Router>
      </SessionProvider>
    </ChakraProvider>
  );
}

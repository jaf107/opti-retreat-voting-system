import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Image,
  Heading,
} from "@chakra-ui/react";
import { SessionProvider } from "./contexts/SessionContext";
import useSession from "./hooks/useSession";
import { FaAward, FaChartPie } from "react-icons/fa";

import Homepage from "./components/Homepage";
import VotingFlow from "./components/VotingFlow";
import ResultsDashboard from "./components/ResultsDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import CategoryManagement from "./components/admin/CategoryManagement";

export default function App() {
  const session = useSession();

  return (
    <ChakraProvider>
      <SessionProvider value={session}>
        <Router>
          <Flex flexDirection="column" minHeight="100vh">
            <Flex as="nav" p={4} alignItems="center" bg="white" boxShadow="sm">
              <Flex flex="1" alignItems="center" justifyContent={"center"}>
                <Link to="/">
                  <Image
                    src="/optimizely-logo.png"
                    height="24px"
                    alt="Optimizely Logo"
                    mr={4}
                  />
                </Link>
                <Heading as="h2" size="md" fontWeight="bold">
                  UnOptimized Awards 2024
                </Heading>
              </Flex>
            </Flex>
            <Box flex="1" overflowY="auto" p={4} bg="gray.100">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/vote/:categoryId" element={<VotingFlow />} />
                <Route path="/admin/result" element={<ResultsDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                  path="/admin/categories"
                  element={<CategoryManagement />}
                />
              </Routes>
            </Box>
          </Flex>
        </Router>
      </SessionProvider>
    </ChakraProvider>
  );
}

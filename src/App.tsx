import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Heading,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "./contexts/SessionContext";
import useSession from "./hooks/useSession";

import Homepage from "./components/Homepage";
import VotingFlow from "./components/VotingFlow";
import AdminDashboard from "./components/admin/AdminDashboard";
import VotingConclusion from "./components/VotingConclusion";
import AnnouncementConclusion from "./components/admin/announcement/AnnouncementConclusion";
import { BackgroundProvider } from "./contexts/BackgroundContext";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Homepage />} />
        <Route path="/vote/:categoryId" element={<VotingFlow />} />
        <Route path="/vote/conclusion" element={<VotingConclusion />} />
        <Route path="/adios" element={<AnnouncementConclusion />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const session = useSession();

  return (
    <ChakraProvider>
      <SessionProvider value={session}>
        <BackgroundProvider>
          <Router>
            <Flex flexDirection="column" minHeight="100vh">
              <Flex
                as="nav"
                p={4}
                alignItems="center"
                bg="white"
                boxShadow="sm"
              >
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
                <Flex justifyContent={"flex-end"}>
                  <Link
                    to="/admin"
                    style={{
                      cursor: "default",
                    }}
                  >
                    <Text color={"white"}>A</Text>
                  </Link>
                </Flex>
              </Flex>
              <Box flex="1" overflowY="auto" p={4} bg="gray.100">
                <AnimatedRoutes />
              </Box>
            </Flex>
          </Router>
        </BackgroundProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

import React, { useEffect } from "react";
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
import { SessionProvider } from "./contexts/SessionContext";
import {
  BackgroundProvider,
  useBackground,
} from "./contexts/BackgroundContext";
import useSession from "./hooks/useSession";

import Homepage from "./components/Homepage";
import VotingFlow from "./components/VotingFlow";
import AdminDashboard from "./components/admin/AdminDashboard";
import VotingConclusion from "./components/VotingConclusion";
import AnnouncementConclusion from "./components/admin/announcement/AnnouncementConclusion";

const AppContent = () => {
  const { currentBackground, setBackgroundType } = useBackground();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/vote")) {
      setBackgroundType("voting");
    } else if (
      location.pathname.startsWith("/admin/announce") ||
      location.pathname === "/adios"
    ) {
      setBackgroundType("announcement");
    } else {
      setBackgroundType("default");
    }
  }, [location.pathname, setBackgroundType]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage={`url("${currentBackground}")`}
        backgroundSize="contain"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        zIndex={-1}
      />
      <Flex
        as="nav"
        p={4}
        alignItems="center"
        bg="white"
        boxShadow="sm"
        zIndex={1}
      >
        <Flex flex="1" alignItems="center" justifyContent="center">
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
        <Flex justifyContent="flex-end">
          <Link
            to="/admin"
            style={{
              cursor: "default",
            }}
          >
            <Text color="white">A</Text>
          </Link>
        </Flex>
      </Flex>
      <Box flex="1" overflowY="auto" p={4} position="relative" zIndex={1}>
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255, 255, 255, 0.9)"
          zIndex={-1}
        />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/vote/:categoryId" element={<VotingFlow />} />
          <Route path="/vote/conclusion" element={<VotingConclusion />} />
          <Route path="/adios" element={<AnnouncementConclusion />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default function App() {
  const session = useSession();

  return (
    <ChakraProvider>
      <SessionProvider value={session}>
        <BackgroundProvider>
          <Router>
            <AppContent />
          </Router>
        </BackgroundProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

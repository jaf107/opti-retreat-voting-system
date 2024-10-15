import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useAdminStatus } from "../../hooks/useAdminStatus";

export const AdminHome: React.FC = () => {
  const { isVotingEnabled, toggleVoting } = useAdminStatus();

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Voting Status </Heading>
        <Text>Current status: {isVotingEnabled ? "Enabled" : "Disabled"}</Text>
        <Button
          colorScheme={isVotingEnabled ? "red" : "green"}
          onClick={toggleVoting}
        >
          {isVotingEnabled ? "Stop Voting" : "Start Voting"}
        </Button>
      </VStack>
    </Box>
  );
};

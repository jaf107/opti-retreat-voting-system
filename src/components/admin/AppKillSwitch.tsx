import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useAdminStatus } from "../../hooks/useAdminStatus";

export const AppKillSwitch: React.FC = () => {
  const { isVotingEnabled, toggleVoting } = useAdminStatus();

  return (
    <Flex
      p={8}
      borderRadius="lg"
      shadow="lg"
      gap={"30px"}
      flexDirection={"column"}
    >
      <Heading size={"md"} textAlign={"center"}>
        App Status
      </Heading>
      <Text>Current status: {isVotingEnabled ? "Enabled" : "Disabled"}</Text>

      <Button
        colorScheme={isVotingEnabled ? "red" : "green"}
        onClick={toggleVoting}
      >
        {isVotingEnabled ? "Stop Voting" : "Start Voting"}
      </Button>
    </Flex>
  );
};

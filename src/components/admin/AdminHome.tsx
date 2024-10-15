import { Button, SimpleGrid, Text } from "@chakra-ui/react";
import { AdminCard } from "./AdminCard";
import { useAdminStatus } from "../../hooks/useAdminStatus";
import { Link } from "react-router-dom";

export const AdminHome: React.FC = () => {
  const { isVotingEnabled, toggleVoting } = useAdminStatus();

  return (
    <SimpleGrid columns={{ base: 1 }} spacing={8} width="100%">
      <AdminCard title="Voting Status">
        <Text>Current status: {isVotingEnabled ? "Enabled" : "Disabled"}</Text>
        <Button
          colorScheme={isVotingEnabled ? "red" : "green"}
          onClick={toggleVoting}
        >
          {isVotingEnabled ? "Stop Voting" : "Start Voting"}
        </Button>
      </AdminCard>

      <AdminCard title="Category Management">
        <Button as={Link} to="/admin/categories" colorScheme="blue">
          Manage Categories
        </Button>
      </AdminCard>

      <AdminCard title="Announcement">
        <Button as={Link} to="/admin/announce" colorScheme="blue">
          Start Announcements
        </Button>
      </AdminCard>
    </SimpleGrid>
  );
};

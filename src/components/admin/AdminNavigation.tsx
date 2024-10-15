import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const AdminNavigation: React.FC = () => (
  <Flex width="100%" mb={8} justifyContent="center">
    <Button as={Link} to="/admin" mr={4}>
      App
    </Button>
    <Button as={Link} to="/admin/categories" mr={4}>
      Categories
    </Button>
    <Button as={Link} to="/admin/announce">
      Announcement
    </Button>
  </Flex>
);

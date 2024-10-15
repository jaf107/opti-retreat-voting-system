import { Box, Heading, VStack } from "@chakra-ui/react";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
}

export const AdminCard: React.FC<AdminCardProps> = ({ title, children }) => (
  <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
    <VStack spacing={4} align="stretch">
      <Heading size="md">{title}</Heading>
      {children}
    </VStack>
  </Box>
);

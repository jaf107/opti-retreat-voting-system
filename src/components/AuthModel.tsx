import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onAuthenticate: (password: string) => boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onAuthenticate,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const isSuccess = onAuthenticate(password);
    if (!isSuccess) {
      setError("Invalid password");
      setPassword("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Admin Authentication Required</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-end" gap={"5"}>
          <Button colorScheme="red" as={Link} to={"/"} onClick={() => {}}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Authenticate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

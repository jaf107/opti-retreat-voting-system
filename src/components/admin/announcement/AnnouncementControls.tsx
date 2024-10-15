import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";

interface AnnouncementControlsProps {
  showWinner: boolean;
  onShowWinner: () => void;
  onNext: () => void;
  isLastCategory: boolean;
}

export const AnnouncementControls: React.FC<AnnouncementControlsProps> = ({
  showWinner,
  onShowWinner,
  onNext,
  isLastCategory,
}) => (
  <Flex
    position="fixed"
    bottom="0"
    left="0"
    right="0"
    justifyContent="space-between"
    alignItems="center"
    p={4}
    bg="white"
    boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
    zIndex={10}
  >
    <Box style={{ color: "white" }}>Placeholder</Box>
    <Button
      isDisabled={showWinner}
      onClick={onShowWinner}
      colorScheme="blue"
      size="sm"
    >
      Show Winner
    </Button>
    <Button
      onClick={onNext}
      rightIcon={<ChevronRightIcon />}
      variant="outline"
      size="sm"
      isDisabled={!showWinner}
    >
      {isLastCategory ? "Finish" : "Next Category"}
    </Button>
  </Flex>
);

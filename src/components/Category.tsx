import {
  Box,
  Image,
  Text,
  VStack,
  AspectRatio,
  chakra,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { Choice } from "../models/Choice";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

interface CategoryProps {
  choice: Choice;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (choiceId: string) => void;
}

export default function Category({
  choice,
  isSelected,
  isDisabled,
  onSelect,
}: CategoryProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      width="100%"
    >
      <Box
        borderWidth={isSelected ? "6px" : "1px"}
        borderColor={isSelected ? "green.500" : "gray.200"}
        borderRadius="xl"
        overflow="hidden"
        cursor={isDisabled ? "not-allowed" : "pointer"}
        onClick={() => !isDisabled && onSelect(choice.id)}
        bg={isSelected ? "blue.50" : "white"}
        transition="all 0.3s"
        _hover={{ transform: isDisabled ? "none" : "translateY(-5px)" }}
        height="100%"
        display="flex"
        flexDirection="column"
        opacity={isDisabled && !isSelected ? 0.5 : 1}
      >
        <AspectRatio ratio={1} width="100%">
          <Image
            src={choice.image_src}
            alt={choice.name}
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </AspectRatio>
        <VStack p={2} alignItems="center" justifyContent="center" flex="1">
          <Text fontWeight="bold" fontSize="sm">
            {choice.name}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
}

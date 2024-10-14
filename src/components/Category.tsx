import React from "react";
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
  onSelect: (choiceId: string) => void;
}

const Category: React.FC<CategoryProps> = ({
  choice,
  isSelected,
  onSelect,
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      width="100%"
    >
      <Box
        borderWidth="1px"
        borderRadius="xl"
        overflow="hidden"
        cursor="pointer"
        onClick={() => onSelect(choice.id)}
        bg={isSelected ? "blue.50" : "white"}
        boxShadow={isSelected ? "0 0 0 5px rgba(51, 204, 51, 0.8)" : "lg"}
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)" }}
        height="100%"
        display="flex"
        flexDirection="column"
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
};

export default Category;

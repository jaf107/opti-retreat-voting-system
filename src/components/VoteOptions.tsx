import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { SessionContext } from "../App";
import {
  fetchPollOptions,
  submitVote,
  checkIfUserHasVoted,
} from "../utils/supabaseApi";
import {
  SimpleGrid,
  Box,
  Image,
  Button,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";

type Option = {
  id: string;
  name: string;
  image_url: string;
};

const VoteOptions: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const sessionContext = useContext(SessionContext);
  const sessionId = sessionContext?.sessionId || "";
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchOptions = async () => {
      const { data, error } = await fetchPollOptions(categoryId || "");
      if (error) {
        console.error("Error fetching options:", error);
      } else {
        setOptions(data ?? []);
      }
    };
    fetchOptions();
  }, [categoryId]);

  useEffect(() => {
    if (sessionId && categoryId) {
      const checkVote = async () => {
        const { data, error } = await checkIfUserHasVoted(
          sessionId,
          categoryId
        );
        if (!error && data?.length !== undefined && data.length > 0) {
          setHasVoted(true);
        }
      };
      checkVote();
    }
  }, [sessionId, categoryId]);

  const handleVote = async () => {
    if (!selectedOptionId) {
      toast({
        title: "Please select an option",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: "You have already voted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { error } = await submitVote(
      sessionId,
      categoryId || "",
      selectedOptionId
    );
    if (!error) {
      toast({
        title: "Vote submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setHasVoted(true);
    } else {
      toast({
        title: "Error submitting vote",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Vote Options
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {options.map((option) => (
          <Box
            key={option.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <VStack>
              <Image
                src={option.image_url}
                alt={option.name}
                objectFit="cover"
                height="200px"
                width="100%"
              />
              <Box p={4}>
                <Heading as="h3" size="md" mb={2}>
                  {option.name}
                </Heading>
                <Button
                  onClick={() => setSelectedOptionId(option.id)}
                  colorScheme={selectedOptionId === option.id ? "blue" : "gray"}
                  width="100%"
                  disabled={hasVoted}
                >
                  {hasVoted ? "Voted" : "Select"}
                </Button>
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      <Button
        onClick={handleVote}
        mt={4}
        colorScheme="green"
        disabled={hasVoted}
      >
        {hasVoted ? "Vote Submitted" : "Submit Vote"}
      </Button>
    </Box>
  );
};

export default VoteOptions;

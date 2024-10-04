import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  checkIfUserHasVoted,
  submitVote,
  updateVote,
} from "../utils/supabaseApi";

export const useVotingState = (
  categoryId: string | undefined,
  sessionId: string
) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [votedChoiceId, setVotedChoiceId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const toast = useToast();

  const checkIfVoted = useCallback(async () => {
    if (!categoryId || !sessionId) return;

    const { data, error } = await checkIfUserHasVoted(sessionId, categoryId);
    if (!error && Array.isArray(data) && data.length > 0) {
      setHasVoted(true);
      setSelectedChoiceId(data[0].choice_id);
      setVotedChoiceId(data[0].choice_id);
    } else {
      setHasVoted(false);
      setSelectedChoiceId(null);
      setVotedChoiceId(null);
    }
  }, [categoryId, sessionId]);

  const handleVoteSubmission = async () => {
    if (!selectedChoiceId || !categoryId || !sessionId) {
      toast({
        title: "Please select an option",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    let error;
    if (hasVoted) {
      if (selectedChoiceId !== votedChoiceId) {
        ({ error } = await updateVote(sessionId, categoryId, selectedChoiceId));
      } else {
        return;
      }
    } else {
      ({ error } = await submitVote(sessionId, categoryId, selectedChoiceId));
    }

    if (!error) {
      toast({
        title: hasVoted
          ? "Vote updated successfully"
          : "Vote submitted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setHasVoted(true);
      setVotedChoiceId(selectedChoiceId);
    } else {
      toast({
        title: hasVoted ? "Error updating vote" : "Error submitting vote",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    checkIfVoted();
  }, [checkIfVoted]);

  return {
    selectedChoiceId,
    setSelectedChoiceId,
    votedChoiceId,
    hasVoted,
    handleVoteSubmission,
  };
};

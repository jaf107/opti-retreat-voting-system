import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { getAppStatus, toggleAppStatus } from "../utils/supabaseApi";

export const useAdminStatus = () => {
  const [isVotingEnabled, setIsVotingEnabled] = useState<boolean>(false);
  const toast = useToast();

  const checkVotingStatus = async () => {
    try {
      const { data, error } = await getAppStatus();
      if (error) throw error;
      setIsVotingEnabled(!!data?.is_running);
    } catch (error) {
      toast({
        title: "Error checking voting status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const toggleVoting = async () => {
    try {
      const { data, error } = await toggleAppStatus();
      if (error) throw error;
      setIsVotingEnabled(data || false);
      toast({
        title: `Voting ${data ? "enabled" : "disabled"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error toggling voting status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    checkVotingStatus();
  }, []);

  return { isVotingEnabled, toggleVoting };
};

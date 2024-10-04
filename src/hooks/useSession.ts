import { useEffect, useState } from "react";
import { registerUser } from "../utils/controllers/Users";
import { v4 as uuidv4 } from "uuid";

const SESSION_ID_KEY = "sessionId";

const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_ID_KEY);

    if (!savedSessionId) {
      const newSessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, newSessionId);
      setSessionId(newSessionId);
      registerUser(newSessionId);
    } else {
      setSessionId(savedSessionId);
    }
  }, []);

  return { sessionId, hasVoted, setHasVoted };
};

export default useSession;

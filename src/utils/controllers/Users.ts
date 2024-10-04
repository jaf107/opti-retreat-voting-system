import { USERS } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const registerUser = async (sessionId: string) => {
  const { data, error } = await supabase.from(USERS).insert([
    {
      session_id: sessionId,
    },
  ]);
  if (error) {
    console.error("Error registering user:", error);
    return { error };
  }
  return { data };
};

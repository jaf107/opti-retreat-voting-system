import { VOTES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const checkIfUserHasVoted = async (
  sessionId: string,
  categoryId: string
) => {
  try {
    const { data, error } = await supabase
      .from(VOTES)
      .select("*")
      .eq("session_id", sessionId)
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(`Error checking user vote: ${error.message}`);
    }

    return { data, error: null }; // Return data if successful
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

export const submitVote = async (
  sessionId: string,
  categoryId: string,
  choiceId: string
) => {
  try {
    const { data, error } = await supabase.from(VOTES).upsert({
      session_id: sessionId,
      category_id: categoryId,
      choice_id: choiceId,
    });

    if (error) {
      throw new Error(`Error submitting vote: ${error.message}`);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

export const updateVote = async (
  sessionId: string,
  categoryId: string,
  choiceId: string
) => {
  const { data, error } = await supabase
    .from(VOTES)
    .update({ choice_id: choiceId })
    .match({ session_id: sessionId, category_id: categoryId });

  return { data, error };
};

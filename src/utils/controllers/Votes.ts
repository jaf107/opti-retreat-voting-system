import { VOTES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const checkIfUserHasVoted = async (
  sessionId: string,
  categoryId: string
) => {
  const { data, error } = await supabase
    .from(VOTES)
    .select("*")
    .eq("session_id", sessionId)
    .eq("category_id", categoryId);
  return { data, error };
};

export const submitVote = async (
  sessionId: string,
  categoryId: string,
  choiceId: string
) => {
  const { data, error } = await supabase.from(VOTES).upsert({
    session_id: sessionId,
    category_id: categoryId,
    choice_id: choiceId,
  });
  return { data, error };
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

import { RESULTS_FUNCTION } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchResults = async () => {
  const { data, error } = await supabase.rpc(RESULTS_FUNCTION);
  return { data, error };
};

export const fetchChoicesWithVotes = async (categoryId: string) => {
  const { data, error } = await supabase.rpc("get_choices_with_votes", {
    input_category_id: categoryId,
  });
  return { data, error };
};

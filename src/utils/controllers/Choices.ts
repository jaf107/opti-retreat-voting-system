import { CHOICES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchAllChoices = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CHOICES)
    .select("*")
    .eq("category_id", categoryId);

  return { data, error };
};
export const fetchVotingChoices = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CHOICES)
    .select("*")
    .eq("category_id", categoryId)
    .eq("hidden", false);

  return { data, error };
};

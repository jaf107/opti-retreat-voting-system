import { CHOICES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchAllChoices = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CHOICES)
    .select("*")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  return { data, error };
};
export const fetchVotingChoices = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CHOICES)
    .select("*")
    .eq("category_id", categoryId)
    .eq("hidden", false)
    .order("name", { ascending: true });

  return { data, error };
};

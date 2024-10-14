import { CHOICES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchChoices = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CHOICES)
    .select("*")
    .eq("category_id", categoryId);

  return { data, error };
};

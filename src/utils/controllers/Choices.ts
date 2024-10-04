import { CHOICES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchChoices = async (categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from(CHOICES)
      .select("*")
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(`Error fetching poll choices: ${error.message}`);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

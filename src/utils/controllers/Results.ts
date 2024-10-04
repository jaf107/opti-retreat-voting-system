import { RESULTS_FUNCTION } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchResults = async () => {
  try {
    const { data, error } = await supabase.rpc(RESULTS_FUNCTION);
    if (error) {
      throw new Error(`Error fetching results: ${error.message}`);
    }
    return { data, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

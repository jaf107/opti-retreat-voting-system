import { supabase } from "./supabaseClient";

export const getAppStatus = async () => {
  const { data, error } = await supabase
    .from("app_status")
    .select("is_running")
    .eq("id", 1)
    .single();
  return { data, error };
};
export const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  return { data, error };
};

export const fetchPollOptions = async (categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .eq("category_id", categoryId);

    if (error) {
      throw new Error(`Error fetching poll options: ${error.message}`);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

export const checkIfUserHasVoted = async (
  sessionId: string,
  categoryId: string
) => {
  try {
    const { data, error } = await supabase
      .from("user_votes")
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
  optionId: string
) => {
  try {
    const { data, error } = await supabase.from("user_votes").upsert({
      session_id: sessionId,
      category_id: categoryId,
      option_id: optionId,
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

export const fetchResults = async () => {
  try {
    const { data, error } = await supabase.rpc("get_results");
    if (error) {
      throw new Error(`Error fetching results: ${error.message}`);
    }
    return { data, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error };
  }
};

export const registerUser = async (sessionId: string) => {
  const { data, error } = await supabase.from("user_sessions").insert([
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

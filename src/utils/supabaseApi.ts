import {
  APP_STATUS,
  CATEGORIES,
  CHOICES,
  RESULTS_FUNCTION,
  USERS,
  VOTES,
} from "../constants/db.names";
import { supabase } from "./supabaseClient";

export const getAppStatus = async () => {
  const { data, error } = await supabase
    .from(APP_STATUS)
    .select("is_running")
    .eq("id", 1)
    .single();
  return { data, error };
};

export const toggleAppStatus = async () => {
  const { data: currentStatus } = await getAppStatus();

  if (currentStatus === null) {
    return { data: null, error: "Failed to fetch current status" };
  }

  const newStatus = !currentStatus.is_running;

  const { data, error } = await supabase
    .from(APP_STATUS)
    .update({ is_running: newStatus })
    .eq("id", 1)
    .single();

  return { data: newStatus, error: error };
};

export const fetchCategories = async () => {
  const { data, error } = await supabase.from(CATEGORIES).select("*");
  return { data, error };
};

export const fetchCategoriesInOrder = async () => {
  const { data, error } = await supabase
    .from(CATEGORIES)
    .select("*")
    .order("order_index", { ascending: true });
  return { data, error };
};

export const getNextCategory = async (currentCategoryId: string) => {
  const { data: currentCategory, error: currentError } = await supabase
    .from(CATEGORIES)
    .select("order_index")
    .eq("id", currentCategoryId)
    .single();

  if (currentError) return { data: null, error: currentError };

  const { data, error } = await supabase
    .from(CATEGORIES)
    .select("*")
    .gt("order_index", currentCategory.order_index)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  return { data, error };
};

export const getPreviousCategory = async (currentCategoryId: string) => {
  const { data: currentCategory, error: currentError } = await supabase
    .from(CATEGORIES)
    .select("order_index")
    .eq("id", currentCategoryId)
    .single();

  if (currentError) return { data: null, error: currentError };

  const { data, error } = await supabase
    .from(CATEGORIES)
    .select("*")
    .lt("order_index", currentCategory.order_index)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

export const fetchCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from(CATEGORIES)
    .select("*")
    .eq("id", categoryId)
    .single();

  return { data, error };
};

export const fetchPollOptions = async (categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from(CHOICES)
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
  optionId: string
) => {
  try {
    const { data, error } = await supabase.from(VOTES).upsert({
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

export const updateVote = async (
  sessionId: string,
  categoryId: string,
  optionId: string
) => {
  const { data, error } = await supabase
    .from(VOTES)
    .update({ option_id: optionId })
    .match({ session_id: sessionId, category_id: categoryId });

  return { data, error };
};

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

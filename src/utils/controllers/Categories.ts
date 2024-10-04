import { CATEGORIES } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

export const fetchCategories = async () => {
  const { data, error } = await supabase.from(CATEGORIES).select("*");
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

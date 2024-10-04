import { APP_STATUS } from "../../constants/db.names";
import { supabase } from "../supabaseClient";

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

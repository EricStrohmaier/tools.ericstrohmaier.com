"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const insertWaitlistEmail = async (email: string): Promise<any> => {
  const supabase = supabaseAdmin();

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    return { error: "Email already exists" };
  }
  const { data, error } = await supabase.from("waitlist").insert([{ email }]);

  if (error) {
    console.error("Error inserting email to waitlist:", error);
    return { error: "Error inserting email to waitlist" };
  }
  return data;
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("waitlist")
    .select("email")
    .eq("email", email);

  if (error) {
    console.error("Error checking email:", error);
    return false;
  }
  return data.length > 0;
};

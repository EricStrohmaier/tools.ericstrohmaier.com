"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Types
export type Project = {
  id: string;
  name: string;
  description?: string;
  client?: string;
  hourly_rate?: number;
  created_at: string;
  user_id: string;
  is_active: boolean;
};

export type TimeEntry = {
  id: string;
  project_id: string;
  user_id: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  created_at: string;
  tags?: string[];
};

export type TimeFilterOptions = {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  tags?: string[];
  timezone?: string; // IANA timezone string (e.g., "America/New_York")
};

// User functions
export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Project functions
export const getProjects = async (): Promise<Project[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data as Project[];
};

export const getProject = async (id: string): Promise<Project | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data as Project;
};

export const createProject = async (
  project: Omit<Project, "id" | "created_at" | "user_id">
): Promise<{ data?: Project; error?: string }> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as Project };
};

export const updateProject = async (
  id: string,
  project: Partial<Project>
): Promise<{ data?: Project; error?: string }> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as Project };
};

export const deleteProject = async (
  id: string
): Promise<{ success?: boolean; error?: string }> => {
  const supabase = createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

// Helper to get timezone offset in minutes for a specific timezone and date
const getTimezoneOffset = (timezone: string, date: Date): number => {
  // Get the UTC time string
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  // Get the time in the target timezone
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  // The difference is the offset
  return (utcDate.getTime() - tzDate.getTime()) / (60 * 1000);
};

// Helper to convert a date string in user's timezone to UTC ISO string
const toUTCDateString = (
  dateStr: string,
  timezone: string,
  isEndOfDay: boolean
): string => {
  // dateStr is in format "yyyy-MM-dd"
  // We want to interpret this as a date in the user's timezone
  const timePart = isEndOfDay ? "T23:59:59.999" : "T00:00:00.000";

  // Create a reference date in UTC to calculate the offset for that day
  // This handles DST correctly since offset can vary by date
  const refDate = new Date(`${dateStr}T12:00:00Z`);
  const offsetMinutes = getTimezoneOffset(timezone, refDate);

  // Create the UTC date by parsing as UTC and adjusting for the timezone offset
  // If user is in GMT-5 (offset = -300), local midnight = UTC 05:00
  // So we need to ADD the offset (which is negative) to get UTC
  const utcDate = new Date(`${dateStr}${timePart}Z`);
  utcDate.setMinutes(utcDate.getMinutes() + offsetMinutes);

  return utcDate.toISOString();
};

// Time entry functions
export const getTimeEntries = async (
  filters?: TimeFilterOptions
): Promise<TimeEntry[]> => {
  const supabase = createClient();
  let query = supabase.from("time_entries").select("*");

  // Use the user's timezone or fall back to UTC
  const timezone = filters?.timezone || "UTC";

  if (filters?.startDate) {
    // Convert the start date (start of day in user's timezone) to UTC
    const startDateUTC = toUTCDateString(filters.startDate, timezone, false);
    query = query.gte("start_time", startDateUTC);
  }

  if (filters?.endDate) {
    // Convert the end date (end of day in user's timezone) to UTC
    // Add one day and use the start of that day to ensure we include all of the end date
    const endDateUTC = toUTCDateString(filters.endDate, timezone, true);
    query = query.lte("start_time", endDateUTC);
  }

  if (filters?.projectId) {
    query = query.eq("project_id", filters.projectId);
  }

  if (filters?.tags && filters.tags.length > 0) {
    // This assumes tags is stored as an array in Supabase
    query = query.contains("tags", filters.tags);
  }

  const { data, error } = await query.order("start_time", { ascending: false });

  if (error) {
    console.error("Error fetching time entries:", error);
    return [];
  }

  return data as TimeEntry[];
};

export const getTimeEntry = async (id: string): Promise<TimeEntry | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching time entry:", error);
    return null;
  }

  return data as TimeEntry;
};

export const createTimeEntry = async (
  timeEntry: Omit<TimeEntry, "id" | "created_at" | "user_id">
): Promise<{ data?: TimeEntry; error?: string }> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("time_entries")
    .insert([{ ...timeEntry, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error("Error creating time entry:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as TimeEntry };
};

export const updateTimeEntry = async (
  id: string,
  timeEntry: Partial<TimeEntry>
): Promise<{ data?: TimeEntry; error?: string }> => {
  const supabase = createClient();

  console.log("Updating time entry:", id, timeEntry);

  const { data, error } = await supabase
    .from("time_entries")
    .update(timeEntry)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating time entry:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as TimeEntry };
};

export const deleteTimeEntry = async (
  id: string
): Promise<{ success?: boolean; error?: string }> => {
  const supabase = createClient();

  const { error } = await supabase.from("time_entries").delete().eq("id", id);

  if (error) {
    console.error("Error deleting time entry:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

export const startTimeTracking = async (
  projectId: string,
  description?: string,
  tags?: string[]
): Promise<{ data?: TimeEntry; error?: string }> => {
  // Store the date with timezone information preserved
  const now = new Date();
  // Convert to ISO string but store the timezone offset
  const nowWithTimezone = now.toISOString();

  return createTimeEntry({
    project_id: projectId,
    description,
    start_time: nowWithTimezone,
    tags,
  });
};

export const stopTimeTracking = async (
  timeEntryId: string
): Promise<{ data?: TimeEntry; error?: string }> => {
  const timeEntry = await getTimeEntry(timeEntryId);

  if (!timeEntry) {
    return { error: "Time entry not found" };
  }

  if (timeEntry.end_time) {
    return { error: "Time entry already stopped" };
  }

  // Store the date with timezone information preserved
  const now = new Date();
  const nowWithTimezone = now.toISOString();

  // Parse the start time correctly preserving timezone
  const startTime = new Date(timeEntry.start_time);
  const endTime = now;
  const durationInSeconds = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000
  );

  return updateTimeEntry(timeEntryId, {
    end_time: nowWithTimezone,
    duration: durationInSeconds,
  });
};

// Create a time entry manually with specified duration
export const createManualTimeEntry = async (
  timeEntry: Omit<TimeEntry, "id" | "created_at" | "user_id">
): Promise<{ data?: TimeEntry; error?: string }> => {
  const supabase = createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("time_entries")
    .insert([{ ...timeEntry, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error("Error creating time entry:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as TimeEntry };
};

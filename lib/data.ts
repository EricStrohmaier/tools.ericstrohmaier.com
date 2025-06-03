import { createClient } from "@/utils/supabase/client";

export interface FocusItem {
  id?: string;
  day: string;
  project: string;
  task: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string | null;
}

// Empty default focus items
export const emptyWeeklyPlan: FocusItem[] = [
  { day: "Monday", project: "", task: "" },
  { day: "Tuesday", project: "", task: "" },
  { day: "Wednesday", project: "", task: "" },
  { day: "Thursday", project: "", task: "" },
  { day: "Friday", project: "", task: "" },
  { day: "Saturday", project: "", task: "" },
  { day: "Sunday", project: "", task: "" },
];

// Get the current day name
export function getCurrentDayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  return days[today.getDay()];
}

// Mutable state for the weekly plan
export let weeklyPlan: FocusItem[] = [];

// Function to fetch focus items from Supabase
export async function fetchFocusItems(userId: string): Promise<FocusItem[]> {
  const supabase = createClient();
  
  // Get focus items for the user
  const { data, error } = await supabase
    .from('focus_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching focus items:', error);
    return [];
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Filter to ensure only one item per day (take the first one for each day)
  const dayMap = new Map<string, FocusItem>();
  data.forEach(item => {
    if (!dayMap.has(item.day)) {
      dayMap.set(item.day, item);
    }
  });
  
  // Convert map back to array and ensure it's in the correct order (Monday first)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const filteredItems = days
    .map(day => dayMap.get(day))
    .filter((item): item is FocusItem => item !== undefined);
  
  // Update the mutable state
  weeklyPlan = filteredItems;
  
  return filteredItems;
}

// Function to save a focus item
export async function saveFocusItem(item: FocusItem): Promise<boolean> {
  const supabase = createClient();
  
  // Ensure user_id is a string
  if (!item.user_id) {
    console.error('Error saving focus item: user_id is required');
    return false;
  }
  
  // Prepare the item with updated timestamp
  const focusItem = {
    ...item,
    updated_at: new Date().toISOString()
  };
  
  // If item has an id, update it, otherwise insert a new one
  let data;
  let error;
  
  if (item.id) {
    // Update existing item
    const result = await supabase
      .from('focus_items')
      .update(focusItem)
      .eq('id', item.id)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  } else {
    // Insert new item with created_at timestamp
    const insertData = {
      day: focusItem.day,
      project: focusItem.project,
      task: focusItem.task,
      user_id: focusItem.user_id as string, // Ensure this is a string
      created_at: new Date().toISOString(),
      updated_at: focusItem.updated_at
    };
    
    const result = await supabase
      .from('focus_items')
      .insert(insertData)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  }
  
  if (error) {
    console.error('Error saving focus item:', error);
    return false;
  }
  
  // Update the local state
  if (data) {
    const index = weeklyPlan.findIndex(i => i.day === data.day);
    if (index >= 0) {
      weeklyPlan[index] = data;
    } else {
      weeklyPlan.push(data);
    }
  }
  
  return true;
}

// Function to swap two focus items (change their days)
export async function swapFocusItems(item1Id: string, item2Id: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  
  // Get both items
  const { data: items, error: fetchError } = await supabase
    .from('focus_items')
    .select('*')
    .in('id', [item1Id, item2Id])
    .eq('user_id', userId);
  
  if (fetchError || !items || items.length !== 2) {
    console.error('Error fetching items to swap:', fetchError);
    return false;
  }
  
  // Swap the days
  const item1 = items[0];
  const item2 = items[1];
  const tempDay = item1.day;
  
  // Update both items with swapped days
  const { error: updateError } = await supabase
    .from('focus_items')
    .upsert([
      { ...item1, day: item2.day, updated_at: new Date().toISOString() },
      { ...item2, day: tempDay, updated_at: new Date().toISOString() }
    ]);
  
  if (updateError) {
    console.error('Error swapping focus items:', updateError);
    return false;
  }
  
  // Update local state
  const idx1 = weeklyPlan.findIndex(i => i.id === item1Id);
  const idx2 = weeklyPlan.findIndex(i => i.id === item2Id);
  
  if (idx1 >= 0 && idx2 >= 0) {
    const temp = weeklyPlan[idx1].day;
    weeklyPlan[idx1].day = weeklyPlan[idx2].day;
    weeklyPlan[idx2].day = temp;
  }
  
  return true;
}

// Function to initialize empty focus items if none exist
export async function initializeFocusItems(userId: string): Promise<void> {
  const supabase = createClient();
  
  // Check if user already has focus items
  const { data, error } = await supabase
    .from('focus_items')
    .select('id')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error checking focus items:', error);
    return;
  }
  
  // If no items exist, create empty ones
  if (!data || data.length === 0) {
    const items = emptyWeeklyPlan.map(item => ({
      ...item,
      user_id: userId,
      created_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('focus_items')
      .insert(items);
    
    if (insertError) {
      console.error('Error initializing focus items:', insertError);
    }
  }
}

// Get the current day index (0-6, where 0 is Monday)
export function getCurrentDayIndex(): number {
  const today = new Date();
  // Convert from Sunday-Saturday (0-6) to Monday-Sunday (0-6)
  return (today.getDay() + 6) % 7;
}

export function getCurrentFocusItem(): FocusItem | null {
  if (weeklyPlan.length === 0) return null;
  return weeklyPlan[getCurrentDayIndex()];
}

// Function to check if we need to reset focus items for a new week
export async function checkAndResetForNewWeek(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  // Get the current date
  const now = new Date();
  const today = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  
  // We'll use localStorage to track when we last reset
  let lastReset = null;
  try {
    const lastResetStr = localStorage.getItem(`focus_reset_${userId}`);
    if (lastResetStr) {
      lastReset = new Date(lastResetStr);
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
  
  // If it's Monday and we haven't reset this week yet
  if (today === 1) { // Monday
    // If we don't have a last reset or it was before this Monday
    if (!lastReset || isBeforeThisMonday(lastReset)) {
      // Delete old focus items
      const { error } = await supabase
        .from('focus_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error deleting old focus items:', error);
        return false;
      }
      
      // Save the reset timestamp to localStorage
      try {
        localStorage.setItem(`focus_reset_${userId}`, now.toISOString());
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // Initialize new empty focus items
      await initializeFocusItems(userId);
      
      return true; // We did reset
    }
  }
  
  return false; // No reset needed
}

// Helper function to check if a date is before this Monday
function isBeforeThisMonday(date: Date): boolean {
  const now = new Date();
  const thisMonday = new Date(now);
  const daysSinceMonday = (now.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  thisMonday.setDate(now.getDate() - daysSinceMonday);
  thisMonday.setHours(0, 0, 0, 0);
  
  return date < thisMonday;
}

// Function to create a new focus item
export async function createFocusItem(day: string, userId: string): Promise<FocusItem | null> {
  const supabase = createClient();
  
  // Ensure user_id is a string (not undefined) to satisfy TypeScript
  const newItem = {
    day,
    project: "",
    task: "",
    user_id: userId, // This is definitely a string
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('focus_items')
    .insert(newItem)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating focus item:', error);
    return null;
  }
  
  // Update local state
  if (data) {
    weeklyPlan.push(data);
  }
  
  return data;
}

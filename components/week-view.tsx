"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getCurrentDayIndex,
  fetchFocusItems,
  saveFocusItem,
  initializeFocusItems,
  swapFocusItems,
  createFocusItem,
  checkAndResetForNewWeek,
  FocusItem,
} from "@/lib/data";
import { FocusCard } from "./focus-card";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, MoveUp, MoveDown, Plus } from "lucide-react";

interface WeekViewProps {
  initialShowFullWeek?: boolean;
}

export function WeekView({ initialShowFullWeek = false }: WeekViewProps) {
  // Single source of truth for view state
  const [showFullWeek, setShowFullWeek] = useState(initialShowFullWeek);
  const [currentDayIndex, setCurrentDayIndex] = useState(1); // Tuesday (index 1)
  const [fadeState, setFadeState] = useState("in");
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<FocusItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false); // Prevent multiple toggles

  // Get the current user and fetch focus items
  useEffect(() => {
    const fetchUserAndItems = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // Get user session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check if we need to reset for a new week (on Mondays)
        const didReset = await checkAndResetForNewWeek(user.id);

        if (didReset) {
          console.log("Reset focus items for new week");
          // If we reset, we've already initialized new items
        } else {
          // Initialize focus items if needed (and it's not Monday)
          await initializeFocusItems(user.id);
        }

        // Fetch focus items
        const items = await fetchFocusItems(user.id);
        setFocusItems(items);
      } else {
        // If not logged in, show empty state
        setFocusItems([]);
      }

      // Set current day index
      setCurrentDayIndex(getCurrentDayIndex());
      setIsLoading(false);
    };

    fetchUserAndItems();
  }, []);

  // Toggle between full week and single day view - wrapped in useCallback to avoid dependency issues
  const toggleView = useCallback(() => {
    // Prevent multiple toggles while animation is in progress
    if (isToggling) return;

    setIsToggling(true);
    setFadeState("out");

    setTimeout(() => {
      setShowFullWeek((prev) => !prev);
      setFadeState("in");

      // Allow toggling again after animation completes
      setTimeout(() => {
        setIsToggling(false);
      }, 300);
    }, 200);
  }, [isToggling]);

  // Add keyboard listener for space key to toggle view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle space key when not editing and prevent multiple rapid toggles
      if (e.code === "Space" && !isEditing && !e.repeat && !isToggling) {
        e.preventDefault();
        e.stopPropagation();
        toggleView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, toggleView, isToggling]);

  // Handle editing a focus item
  const handleEdit = (item: FocusItem) => {
    setEditItem({ ...item });
    setIsEditing(true);
  };

  // Handle creating a new focus item
  const handleCreateItem = async (day: string) => {
    if (!user) return;

    setIsLoading(true);
    const newItem = await createFocusItem(day, user.id);

    if (newItem) {
      // Refresh items to get the updated list
      const items = await fetchFocusItems(user.id);
      setFocusItems(items);

      // Open edit dialog for the new item
      setEditItem(newItem);
      setIsEditing(true);
    }

    setIsLoading(false);
  };

  // Handle saving edited item
  const handleSave = async () => {
    if (!editItem || !user) return;

    // Make sure user_id is set
    const itemToSave = {
      ...editItem,
      user_id: user.id,
    };

    setIsLoading(true);
    const success = await saveFocusItem(itemToSave);

    if (success) {
      // Refresh items to get the updated list
      const items = await fetchFocusItems(user.id);
      setFocusItems(items);
    }

    setIsEditing(false);
    setEditItem(null);
    setIsLoading(false);
  };

  // Handle swapping focus items
  const handleSwapItems = async (currentIndex: number, targetIndex: number) => {
    if (!user || !focusItems[currentIndex]?.id || !focusItems[targetIndex]?.id)
      return;

    setIsLoading(true);
    const success = await swapFocusItems(
      focusItems[currentIndex].id!,
      focusItems[targetIndex].id!,
      user.id
    );

    if (success) {
      // Refresh the items to get the updated order
      const items = await fetchFocusItems(user.id);
      setFocusItems(items);
    }

    setIsLoading(false);
  };

  // Move an item up in the list
  const moveItemUp = (index: number) => {
    if (index <= 0) return; // Already at the top
    handleSwapItems(index, index - 1);
  };

  // Move an item down in the list
  const moveItemDown = (index: number) => {
    if (index >= focusItems.length - 1) return; // Already at the bottom
    handleSwapItems(index, index + 1);
  };

  // Define the days of the week we want to show
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleView}
          aria-label={showFullWeek ? "Show today only" : "Show full week"}
          title={showFullWeek ? "Show today only" : "Show full week"}
        ></button>
      </div>

      <div
        className={`transition-opacity duration-150 ${
          fadeState === "out" ? "opacity-0" : "opacity-100"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        ) : focusItems.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#2A2A2A] rounded-lg p-6">
            <p className="text-gray-400 mb-6">
              No focus items yet. Create your weekly focus plan.
            </p>
            {user && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-4xl">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => handleCreateItem(day)}
                    className="flex flex-col items-center justify-center p-6 bg-[#333333] hover:bg-[#444444] rounded-lg transition-colors"
                  >
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-300">{day}</span>
                  </button>
                ))}
              </div>
            )}
            {!user && (
              <p className="text-gray-500 text-sm">
                Sign in to create and manage your focus items.
              </p>
            )}
          </div>
        ) : // Conditionally render either full week or single day view
        showFullWeek ? (
          // Full week view - only show one item per day
          <div className="grid gap-4 md:grid-cols-5 md:gap-6">
            {/* Only render each day once by using the day as a key */}
            {weekDays.map((day) => {
              // Find the focus item for this day
              const item = focusItems.find((item) => item.day === day);
              const index = item ? focusItems.indexOf(item) : -1;

              return (
                <div key={day} className="relative group">
                  {item ? (
                    <FocusCard
                      item={item}
                      isActive={day === "Tuesday"} // Tuesday is the current day
                    />
                  ) : (
                    // Empty placeholder for days without focus items
                    <div className="border border-dashed border-gray-700 rounded-lg p-4 h-full">
                      <div className="text-sm font-medium text-gray-500 uppercase">
                        {day}
                      </div>
                      <div className="mt-2 text-xs italic text-gray-600">
                        No focus item set
                      </div>
                      {user && (
                        <button
                          onClick={() => handleCreateItem(day)}
                          className="mt-4 flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-300"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Create</span>
                        </button>
                      )}
                    </div>
                  )}
                  {user && item && (
                    <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => moveItemUp(index)}
                          className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                          aria-label="Move Up"
                        >
                          <MoveUp className="h-4 w-4" />
                        </button>
                      )}
                      {index < focusItems.length - 1 && (
                        <button
                          onClick={() => moveItemDown(index)}
                          className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                          aria-label="Move Down"
                        >
                          <MoveDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Single day view
          <div className="max-w-md mx-auto relative group">
            {focusItems[currentDayIndex] ? (
              <>
                <FocusCard item={focusItems[currentDayIndex]} isActive={true} />
                {user && (
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleEdit(focusItems[currentDayIndex])}
                      className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveItemUp(currentDayIndex)}
                      className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                      aria-label="Move Up"
                      disabled={currentDayIndex === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveItemDown(currentDayIndex)}
                      className="p-2 rounded-md bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors"
                      aria-label="Move Down"
                      disabled={currentDayIndex === focusItems.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] bg-[#2A2A2A] rounded-lg p-6">
                <p className="text-gray-400 mb-4">No focus item for today.</p>
                {user && (
                  <button
                    onClick={() => handleCreateItem(weekDays[currentDayIndex])}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#333333] hover:bg-[#444444] rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Create</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Press{" "}
        <kbd className="px-2 py-1 bg-[#2A2A2A] rounded font-mono">Space</kbd> to
        toggle view
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent
          className="bg-[#1E1E1E] border-[#333333] text-white max-w-md"
          onKeyDown={(e) => {
            // Prevent space key from propagating to the parent and toggling the view
            if (e.code === "Space") {
              e.stopPropagation();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editItem?.id ? "Edit Focus Item" : "Create Focus Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="project"
                className="text-sm font-medium text-gray-300"
              >
                Project
              </label>
              <Input
                id="project"
                value={editItem?.project || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem!,
                    project: e.target.value,
                  })
                }
                className="bg-[#2A2A2A] border-[#444444] focus:border-gray-400 text-white"
                placeholder="Enter project name"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="task"
                className="text-sm font-medium text-gray-300"
              >
                Task
              </label>
              <Textarea
                id="task"
                value={editItem?.task || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem!,
                    task: e.target.value,
                  })
                }
                className="bg-[#2A2A2A] border-[#444444] focus:border-gray-400 text-white min-h-[100px]"
                placeholder="Describe the task"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="bg-[#333333] hover:bg-[#444444] text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

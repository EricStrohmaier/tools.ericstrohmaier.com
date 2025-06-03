import { FocusItem } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FocusCard({
  item,
  isActive,
}: {
  item: FocusItem;
  isActive: boolean;
}) {
  const isEmpty = !item.project && !item.task;
  
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg overflow-hidden border",
        isActive
          ? "border-gray-600 bg-[#2A2A2A]"
          : "border-gray-700 bg-[#1E1E1E]",
        isEmpty && "border-dashed"
      )}
    >
      <div
        className={cn(
          "px-4 py-3 text-sm font-medium uppercase",
          isActive ? "bg-[#2A2A2A] text-white" : "bg-[#2A2A2A] text-gray-300"
        )}
      >
        {item.day}
      </div>

      <div className="flex flex-col flex-grow p-4 space-y-2">
        <div className="text-2xl font-medium text-white">
          {item.project || (
            <span className="text-gray-500 italic">No project set</span>
          )}
        </div>

        <div className="text-gray-400 flex-grow">
          {item.task || (
            <span className="text-gray-500 italic">No task set</span>
          )}
        </div>
      </div>
    </div>
  );
}

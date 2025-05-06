"use client";

import { useState, useEffect } from "react";
import {
  TimeEntry,
  Project,
  getTimeEntries,
  getProjects,
  deleteTimeEntry,
} from "@/app/actions";
import { EditTimeEntryForm } from "./EditTimeEntryForm";
import {
  format as formatDate,
  subDays,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TimeTrackingPDFButton } from "./TimeTrackingPDFButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface TimeEntryListProps {}

export function TimeEntryList({}: TimeEntryListProps) {
  // Helper function to format dates with timezone consideration
  const formatDateWithTimezone = (
    date: Date,
    formatStr: string,
    isStartOfDay: boolean
  ): string => {
    // Create a new date object that preserves the local timezone
    const localDate = new Date(date);

    // Set to start of day (00:00:00) or end of day (23:59:59) in local timezone
    if (isStartOfDay) {
      localDate.setHours(0, 0, 0, 0);
    } else {
      localDate.setHours(23, 59, 59, 999);
    }

    // Format the date in the specified format
    return formatDate(localDate, formatStr);
  };
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  // Define date filter options
  type DateFilterOption = {
    id: string;
    label: string;
    getDateRange: () => DateRange;
  };

  const dateFilterOptions: DateFilterOption[] = [
    {
      id: "thisWeek",
      label: "This Week",
      getDateRange: () => {
        const today = new Date();
        return {
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        };
      },
    },
    {
      id: "last7Days",
      label: "Last 7 Days",
      getDateRange: () => {
        const today = new Date();
        return {
          from: subDays(today, 7),
          to: today,
        };
      },
    },
    {
      id: "thisMonth",
      label: "This Month",
      getDateRange: () => {
        const today = new Date();
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
      },
    },
    {
      id: "lastMonth",
      label: "Last Month",
      getDateRange: () => {
        const today = new Date();
        // Calculate last month by subtracting 1 month from current date
        const lastMonth = subMonths(today, 1);
        // Ensure we're using the exact start and end of the month in local time
        const startDate = startOfMonth(lastMonth);
        const endDate = endOfMonth(lastMonth);
        return {
          from: startDate,
          to: endDate,
        };
      },
    },
    {
      id: "thisYear",
      label: "This Year",
      getDateRange: () => {
        const today = new Date();
        return {
          from: startOfYear(today),
          to: endOfYear(today),
        };
      },
    },
    {
      id: "lastYear",
      label: "Last Year",
      getDateRange: () => {
        const today = new Date();
        const lastYear = subYears(today, 1);
        return {
          from: startOfYear(lastYear),
          to: endOfYear(lastYear),
        };
      },
    },
  ];

  const [activeDateFilter, setActiveDateFilter] = useState<string>("last7Days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    dateFilterOptions
      .find((option) => option.id === "last7Days")
      ?.getDateRange()
  );
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timeEntryToEdit, setTimeEntryToEdit] = useState<TimeEntry | null>(
    null
  );

  // Apply a date filter
  const applyDateFilter = (filterId: string) => {
    setActiveDateFilter(filterId);

    if (filterId === "custom") {
      // Keep the current date range for custom
      return;
    }

    // Find the selected filter and apply its date range
    const selectedFilter = dateFilterOptions.find(
      (option) => option.id === filterId
    );
    if (selectedFilter) {
      setDateRange(selectedFilter.getDateRange());
    }
  };

  // Handle manual date range picker changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setActiveDateFilter("custom");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const projectsData = await getProjects();
        setProjects(projectsData);

        // Create a map for quick project lookups
        const projectMapData: Record<string, Project> = {};
        projectsData.forEach((project) => {
          projectMapData[project.id] = project;
        });
        setProjectMap(projectMapData);

        // Fetch time entries with filters
        const filters = {
          startDate: dateRange?.from
            ? formatDateWithTimezone(dateRange.from, "yyyy-MM-dd", true)
            : undefined,
          endDate: dateRange?.to
            ? formatDateWithTimezone(dateRange.to, "yyyy-MM-dd", false)
            : undefined,
          projectId: selectedProject,
        };

        const entriesData = await getTimeEntries(filters);
        setTimeEntries(entriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load time entries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, selectedProject]);

  const handleDeleteTimeEntry = async () => {
    if (!entryToDelete) return;

    // Close the dialog first to prevent UI from being stuck
    setDeleteConfirmOpen(false);
    setIsDeleting(true);

    try {
      const result = await deleteTimeEntry(entryToDelete);
      if (result.error) {
        toast.error(result.error);
      } else {
        // Remove the deleted entry from the state
        setTimeEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== entryToDelete)
        );

        toast.success("Time entry has been deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete time entry");
    } finally {
      setEntryToDelete(null);
      setIsDeleting(false);
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "0h 0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  const calculateTotalHours = (): number => {
    return (
      timeEntries.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0) / 3600
    ); // Convert seconds to hours
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>View and filter your tracked time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="w-full">
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {dateFilterOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant={
                    activeDateFilter === option.id ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => applyDateFilter(option.id)}
                >
                  {option.label}
                </Badge>
              ))}
              <Badge
                variant={activeDateFilter === "custom" ? "default" : "outline"}
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => applyDateFilter("custom")}
              >
                Custom
              </Badge>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Select
                  value={selectedProject || "all"}
                  onValueChange={(value) =>
                    setSelectedProject(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <TimeTrackingPDFButton
                  timeEntries={timeEntries}
                  projects={projectMap}
                  dateRange={dateRange}
                  projectName={
                    selectedProject
                      ? projectMap[selectedProject]?.name
                      : undefined
                  }
                  disabled={timeEntries.length === 0}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading time entries...</p>
            </div>
          ) : timeEntries.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">
                No time entries found for the selected filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {timeEntries.length} entries
                </p>
                <Badge variant="outline" className="font-mono">
                  Total: {calculateTotalHours().toFixed(2)} hours
                </Badge>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.map((entry) => {
                      const project = projectMap[entry.project_id];
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {project?.name || "Unknown Project"}
                          </TableCell>
                          <TableCell>
                            {entry.description || "No description"}
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              parseISO(entry.start_time),
                              "MMM dd, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDuration(entry.duration)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setTimeEntryToEdit(entry);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    if (!isDeleting) {
                                      setEntryToDelete(entry.id);
                                      setDeleteConfirmOpen(true);
                                    }
                                  }}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteConfirmOpen(open);
            if (!open) {
              setEntryToDelete(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this time entry. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTimeEntry}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Time Entry Dialog */}
      {timeEntryToEdit && (
        <EditTimeEntryForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          timeEntry={{
            id: timeEntryToEdit.id,
            description: timeEntryToEdit.description || null,
            start_time: timeEntryToEdit.start_time,
            duration: timeEntryToEdit.duration || 0,
            project_id: timeEntryToEdit.project_id,
          }}
          onTimeEntryUpdated={() => {
            // Reload time entries with the current filters
            const filters = {
              startDate: dateRange?.from
                ? formatDateWithTimezone(dateRange.from, "yyyy-MM-dd", true)
                : undefined,
              endDate: dateRange?.to
                ? formatDateWithTimezone(dateRange.to, "yyyy-MM-dd", false)
                : undefined,
              projectId: selectedProject,
            };

            // Fetch updated time entries
            getTimeEntries(filters)
              .then((entriesData) => {
                setTimeEntries(entriesData);
              })
              .catch((error) => {
                console.error("Error fetching time entries:", error);
                toast.error("Failed to refresh time entries");
              });
          }}
        />
      )}
    </div>
  );
}

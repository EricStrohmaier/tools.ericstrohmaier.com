"use client";

import { useState, useEffect } from "react";
import {
  TimeEntry,
  Project,
  getTimeEntries,
  getProjects,
  deleteTimeEntry,
} from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
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
import { MoreHorizontal, Trash2 } from "lucide-react";
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
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

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
            ? format(dateRange.from, "yyyy-MM-dd")
            : undefined,
          endDate: dateRange?.to
            ? format(dateRange.to, "yyyy-MM-dd")
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
  }, [dateRange, selectedProject, toast]);

  const handleDeleteTimeEntry = async () => {
    if (!entryToDelete) return;

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
      toast.error("Failed to delete time entry");
    } finally {
      setEntryToDelete(null);
      setDeleteConfirmOpen(false);
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
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
                            {format(new Date(entry.start_time), "MMM dd, yyyy")}
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
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setEntryToDelete(entry.id);
                                    setDeleteConfirmOpen(true);
                                  }}
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

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
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
    </div>
  );
}

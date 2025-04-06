"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Project,
  getProject,
  stopTimeTracking,
  updateTimeEntry,
} from "@/app/actions";

import { toast } from "sonner";

interface TimeTrackerProps {
  activeTimeEntry: { id: string; projectId: string } | null;
  onTimeEntryStopped: () => void;
}

export function TimeTracker({
  activeTimeEntry,
  onTimeEntryStopped,
}: TimeTrackerProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [description, setDescription] = useState("");
  const [elapsedTime, setElapsedTime] = useState("0:00:00");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchProjectDetails = async () => {
      if (activeTimeEntry?.projectId) {
        try {
          const projectData = await getProject(activeTimeEntry.projectId);
          if (projectData) {
            setProject(projectData);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      } else {
        setProject(null);
        setStartTime(null);
        setElapsedTime("0:00:00");
      }
    };

    fetchProjectDetails();

    // Start the timer if we have an active time entry
    if (activeTimeEntry) {
      // Initialize with current time
      if (!startTime) {
        setStartTime(new Date());
      }

      // Update the timer every second
      intervalId = setInterval(() => {
        const currentTime = new Date();
        const start = startTime || currentTime; // Fallback to current time if startTime is null
        const diffInSeconds = Math.floor(
          (currentTime.getTime() - start.getTime()) / 1000
        );

        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        setElapsedTime(
          `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTimeEntry, startTime]);

  const handleUpdateDescription = async () => {
    if (!activeTimeEntry) return;

    setIsLoading(true);
    try {
      const result = await updateTimeEntry(activeTimeEntry.id, { description });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Time entry description has been updated");
      }
    } catch (error) {
      toast.error("Failed to update description");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTracking = async () => {
    if (!activeTimeEntry) return;

    setIsLoading(true);
    try {
      // First update the description if it's been changed
      if (description) {
        await updateTimeEntry(activeTimeEntry.id, { description });
      }

      // Then stop the time tracking
      const result = await stopTimeTracking(activeTimeEntry.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        onTimeEntryStopped();
        toast.success(
          `Stopped tracking time for ${project?.name || "project"}`
        );
      }
    } catch (error) {
      toast.error("Failed to stop time tracking");
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeTimeEntry || !project) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Currently Tracking</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {project.name} {project.client && `- ${project.client}`}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg font-mono">
            {elapsedTime}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="text-sm font-medium">
              What are you working on?
            </label>
            <Textarea
              id="description"
              placeholder="Describe what you're working on..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 resize-none"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleUpdateDescription}
          disabled={isLoading || !description}
        >
          Update Description
        </Button>
        <Button
          variant="destructive"
          onClick={handleStopTracking}
          disabled={isLoading}
        >
          Stop Tracking
        </Button>
      </CardFooter>
    </Card>
  );
}

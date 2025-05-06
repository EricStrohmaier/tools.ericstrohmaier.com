"use client";

import { Project } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { startTimeTracking, stopTimeTracking } from "@/app/actions";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  activeTimeEntry?: { id: string; projectId: string } | null;
  onTimeEntryStarted: (timeEntryId: string, projectId: string) => void;
  onTimeEntryStopped: () => void;
  onEditProject?: (project: Project) => void;
}

export function ProjectCard({
  project,
  activeTimeEntry,
  onTimeEntryStarted,
  onTimeEntryStopped,
  onEditProject,
}: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isTracking = activeTimeEntry?.projectId === project.id;

  const handleStartTracking = async () => {
    setIsLoading(true);
    try {
      const result = await startTimeTracking(project.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        onTimeEntryStarted(result.data.id, project.id);
        toast.success(`Now tracking time for ${project.name}`);
      }
    } catch (error) {
      toast.error("Failed to start time tracking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTracking = async () => {
    if (!activeTimeEntry) return;

    setIsLoading(true);
    try {
      const result = await stopTimeTracking(activeTimeEntry.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        onTimeEntryStopped();
        toast.success(`Stopped tracking time for ${project.name}`);
      }
    } catch (error) {
      toast.error("Failed to stop time tracking");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{project.name}</CardTitle>
              {onEditProject && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEditProject(project)}
                  title="Edit project"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription>{project.client || "No client"}</CardDescription>
          </div>
          <Badge variant={project.is_active ? "default" : "secondary"}>
            {project.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {project.description || "No description provided"}
        </p>
        {project.hourly_rate && (
          <p className="text-sm font-medium">
            Rate: ${project.hourly_rate.toFixed(2)}/hour
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isTracking ? (
          <Button
            variant="destructive"
            onClick={handleStopTracking}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Stopping..." : "Stop Tracking"}
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleStartTracking}
            disabled={isLoading || !!activeTimeEntry}
            className="w-full"
          >
            {isLoading
              ? "Starting..."
              : activeTimeEntry
              ? "Finish current task first"
              : "Start Tracking"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

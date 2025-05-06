"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project, getTimeEntries } from "@/app/actions";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { TimeTracker } from "./TimeTracker";
import { TimeEntryList } from "./TimeEntryList";
import { ManualTimeEntryForm } from "./ManualTimeEntryForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

interface DashboardClientProps {
  initialProjects: Project[];
  activeTab?: string;
}

export function DashboardClient({
  initialProjects,
  activeTab = "projects",
}: DashboardClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTimeEntry, setActiveTimeEntry] = useState<{
    id: string;
    projectId: string;
  } | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(
    undefined
  );
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});

  // Create a map of projects for quick lookup
  useEffect(() => {
    const map: Record<string, Project> = {};
    projects.forEach((project) => {
      map[project.id] = project;
    });
    setProjectMap(map);
  }, [projects]);

  // Check for any active time entries on component mount
  useEffect(() => {
    const checkForActiveTimeEntries = async () => {
      try {
        const entries = await getTimeEntries();
        const activeEntry = entries.find((entry) => !entry.end_time);

        if (activeEntry) {
          setActiveTimeEntry({
            id: activeEntry.id,
            projectId: activeEntry.project_id,
          });
        }
      } catch (error) {
        console.error("Error checking for active time entries:", error);
      }
    };

    checkForActiveTimeEntries();
  }, []);

  const handleTimeEntryStarted = (timeEntryId: string, projectId: string) => {
    setActiveTimeEntry({ id: timeEntryId, projectId });
  };

  const handleTimeEntryStopped = () => {
    setActiveTimeEntry(null);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setProjectFormOpen(true);
  };

  const handleProjectFormClose = () => {
    setProjectFormOpen(false);
    setProjectToEdit(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Active Time Tracker */}
      {activeTimeEntry && (
        <TimeTracker
          activeTimeEntry={activeTimeEntry}
          onTimeEntryStopped={handleTimeEntryStopped}
        />
      )}

      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger
              value="projects"
              onClick={() => router.push("/dashboard/projects")}
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="time-entries"
              onClick={() => router.push("/dashboard/time-entries")}
            >
              Time Entries
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => {
              setProjectToEdit(undefined);
              setProjectFormOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <TabsContent value="projects" className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to start tracking time
              </p>
              <Button onClick={() => setProjectFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  activeTimeEntry={activeTimeEntry}
                  onTimeEntryStarted={handleTimeEntryStarted}
                  onTimeEntryStopped={handleTimeEntryStopped}
                  onEditProject={handleEditProject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="time-entries">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <ManualTimeEntryForm
              projects={projects}
              onTimeEntryAdded={() => window.location.reload()}
            />
          </div>
          <TimeEntryList />
        </TabsContent>
      </Tabs>

      <ProjectForm
        project={projectToEdit}
        open={projectFormOpen}
        onOpenChange={handleProjectFormClose}
        onSuccess={() => {
          // Refresh projects after creating or updating a project
          window.location.reload();
        }}
      />
    </div>
  );
}

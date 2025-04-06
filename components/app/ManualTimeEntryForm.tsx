"use client";

import { useState } from "react";
import { Project, createManualTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const timeEntrySchema = z.object({
  project_id: z.string().optional(),
  description: z.string().optional(),
  date: z.date(),
  hours: z.coerce.number().min(0, "Hours must be a positive number"),
  minutes: z.coerce
    .number()
    .min(0, "Minutes must be a positive number")
    .max(59, "Minutes must be between 0 and 59"),
});

type TimeEntryFormValues = z.infer<typeof timeEntrySchema>;

interface ManualTimeEntryFormProps {
  projects: Project[];
  onTimeEntryAdded: () => void;
}

export function ManualTimeEntryForm({
  projects,
  onTimeEntryAdded,
}: ManualTimeEntryFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      project_id: undefined,
      description: "",
      date: new Date(),
      hours: 0,
      minutes: 0,
    },
  });

  const onSubmit = async (data: TimeEntryFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate duration in seconds
      const durationInSeconds = data.hours * 3600 + data.minutes * 60;

      // Set the start time to the beginning of the selected day
      const startTime = new Date(data.date);
      startTime.setHours(0, 0, 0, 0);

      // Calculate end time by adding the duration
      const endTime = new Date(startTime.getTime() + durationInSeconds * 1000);

      const result = await createManualTimeEntry({
        project_id: data.project_id === "empty" ? "" : (data.project_id || ""),
        description: data.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInSeconds,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Time entry added successfully");
        form.reset({
          project_id: undefined,
          description: "",
          date: new Date(),
          hours: 0,
          minutes: 0,
        });
        setOpen(false);
        onTimeEntryAdded();
      }
    } catch (error) {
      toast.error("Failed to add time entry");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Time Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
          <DialogDescription>
            Manually add time spent on a project
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="empty">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you work on?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <div className="relative">
                    <div className="absolute right-3 top-2.5 pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="date"
                      className="pr-10"
                      value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          field.onChange(new Date(e.target.value));
                        }
                      }}
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="59" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Time Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

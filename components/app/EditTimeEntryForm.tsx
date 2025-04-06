"use client";

import { useState, useEffect } from "react";
import { Project, updateTimeEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const timeEntrySchema = z.object({
  description: z.string().optional(),
  date: z.date(),
  hours: z.coerce.number().min(0, "Hours must be a positive number"),
  minutes: z.coerce.number().min(0, "Minutes must be a positive number").max(59, "Minutes must be between 0 and 59"),
});

type TimeEntryFormValues = z.infer<typeof timeEntrySchema>;

interface EditTimeEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeEntry: {
    id: string;
    description: string | null;
    start_time: string;
    duration: number;
    project_id: string;
  };
  onTimeEntryUpdated: () => void;
}

export function EditTimeEntryForm({ 
  open, 
  onOpenChange, 
  timeEntry, 
  onTimeEntryUpdated 
}: EditTimeEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse the duration into hours and minutes
  const hours = Math.floor(timeEntry.duration / 3600);
  const minutes = Math.floor((timeEntry.duration % 3600) / 60);
  
  // Parse the date from the start_time
  const startDate = parseISO(timeEntry.start_time);

  const form = useForm<TimeEntryFormValues>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      description: timeEntry.description || "",
      date: startDate,
      hours: hours,
      minutes: minutes,
    },
  });

  // Update form values when timeEntry changes
  useEffect(() => {
    form.reset({
      description: timeEntry.description || "",
      date: startDate,
      hours: hours,
      minutes: minutes,
    });
  }, [timeEntry, form]);

  const onSubmit = async (data: TimeEntryFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate duration in seconds
      const durationInSeconds = (data.hours * 3600) + (data.minutes * 60);
      
      // Set the start time to the beginning of the selected day
      // but preserve the original time of day
      const originalDate = new Date(timeEntry.start_time);
      const newDate = new Date(data.date);
      
      // Combine the date from the form with the time from the original entry
      newDate.setHours(
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds()
      );
      
      // Calculate end time by adding the duration
      const endTime = new Date(newDate.getTime() + (durationInSeconds * 1000));
      
      const result = await updateTimeEntry(timeEntry.id, {
        description: data.description,
        start_time: newDate.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInSeconds,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Time entry updated successfully");
        onOpenChange(false);
        onTimeEntryUpdated();
      }
    } catch (error) {
      toast.error("Failed to update time entry");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
          <DialogDescription>
            Update the details of your time entry
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                {isSubmitting ? "Updating..." : "Update Time Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

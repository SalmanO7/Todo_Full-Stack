'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { useCreateTask, useUpdateTask } from '@/lib/queries';
import { toast } from 'sonner';
import { Task } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
});

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  userId: string;
}

export function TaskModal({ isOpen, onClose, task, userId }: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Reset form when task changes or modal opens/closes
  useEffect(() => {
    if (isOpen && task) {
      // Editing existing task
      setValue('title', task.title);
      setValue('description', task.description || '');
    } else if (isOpen && !task) {
      // Creating new task
      reset();
    }
  }, [isOpen, task, reset, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      if (task) {
        // Update existing task
        await updateTask.mutateAsync({
          userId,
          taskId: task.id.toString(), // Convert number ID to string
          taskData: {
            title: data.title,
            description: data.description,
          },
        });
        toast.success('Task updated successfully');
      } else {
        // Create new task
        await createTask.mutateAsync({
          userId,
          taskData: {
            title: data.title,
            description: data.description,
          },
        });
        toast.success('Task created successfully');
      }

      reset();
      onClose();
    } catch (error) {
      console.error('Task operation error:', error);
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Task title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message?.toString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Task description (optional)"
              disabled={isSubmitting}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message?.toString()}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Task } from '@/types';
import { useToggleTaskCompletion, useDeleteTask } from '@/lib/queries';
import { toast } from 'sonner';
import { PencilIcon, Trash2Icon, CalendarIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  refetchTasks: () => void;
}

export function TaskCard({ task, onEdit, refetchTasks }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const toggleCompletion = useToggleTaskCompletion();
  const deleteTask = useDeleteTask();

  const handleToggleCompletion = () => {
    // Check for both userId (expected) and user_id (fallback for old backend)
    const userId = task.userId || (task as any).user_id;

    if (!userId) {
      toast.error('User ID is missing for this task');
      return;
    }

    toggleCompletion.mutate(
      { userId, taskId: task.id },
      {
        onError: (error) => {
          toast.error('Failed to update task completion status');
          console.error('Toggle completion error:', error);
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    // Check for both userId (expected) and user_id (fallback for old backend)
    const userId = task.userId || (task as any).user_id;

    if (!userId) {
      toast.error('User ID is missing for this task');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask.mutateAsync({ userId, taskId: task.id });
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={`transition-all duration-200 ${task.completed ? 'bg-muted/30 opacity-80' : ''}`}>
      <CardContent className="p-4 pb-2">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleCompletion}
              disabled={toggleCompletion.isPending}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium truncate ${
                task.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span>
            {task.updatedAt ?
              (() => {
                try {
                  const date = new Date(task.updatedAt);
                  if (isNaN(date.getTime())) {
                    // If date is invalid, try to format the raw string if it exists
                    return task.updatedAt.substring(0, 10); // Show just the date part
                  }
                  return date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                } catch (error) {
                  // If parsing fails, return the raw date string
                  return task.updatedAt.substring(0, 10);
                }
              })()
              : 'Date unknown'}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete task"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            ) : (
              <Trash2Icon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
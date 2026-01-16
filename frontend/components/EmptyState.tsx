import { Button } from '@/components/ui/Button';
import { PlusCircleIcon } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-6 p-4 bg-muted rounded-full">
        <PlusCircleIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tasks yet!</h3>
      <p className="text-muted-foreground mb-6 text-center">
        Get started by creating your first task
      </p>
      <Button onClick={onCreateTask}>
        <PlusCircleIcon className="mr-2 h-4 w-4" />
        Create Task
      </Button>
    </div>
  );
}
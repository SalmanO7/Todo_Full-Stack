import { Task } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { FilterBar } from '@/components/FilterBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useState, useEffect } from 'react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  refetchTasks: () => void;
  initialStatusFilter?: 'all' | 'pending' | 'completed';
  initialSortFilter?: 'created' | 'title';
  onFilterChange?: (newStatus?: 'all' | 'pending' | 'completed', newSort?: 'created' | 'title') => void;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  onEdit,
  refetchTasks,
  initialStatusFilter = 'all',
  initialSortFilter = 'created',
  onFilterChange,
  isLoading = false
}: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>(initialStatusFilter);
  const [sortFilter, setSortFilter] = useState<'created' | 'title'>(initialSortFilter);

  // Update local state when initial filters change
  useEffect(() => {
    setStatusFilter(initialStatusFilter);
    setSortFilter(initialSortFilter);
  }, [initialStatusFilter, initialSortFilter]);

  // Apply filters and sorting
  let filteredTasks = [...tasks];

  // Apply status filter
  if (statusFilter === 'pending') {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  } else if (statusFilter === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }
  // if 'all', don't filter

  // Apply sorting
  if (sortFilter === 'title') {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else { // sort by created date (default)
    filteredTasks.sort((a, b) => {
      try {
        // Handle cases where createdAt might be undefined/null
        if (!a.createdAt || !b.createdAt) {
          if (!a.createdAt && !b.createdAt) return 0;
          return a.createdAt ? 1 : -1;
        }

        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          // Fallback to string comparison if dates are invalid
          return b.createdAt ? (a.createdAt ? b.createdAt.localeCompare(a.createdAt) : 1) : -1;
        }

        return dateB.getTime() - dateA.getTime(); // Descending order
      } catch (error) {
        // Fallback to string comparison
        return b.createdAt ? (a.createdAt ? b.createdAt.localeCompare(a.createdAt) : 1) : -1;
      }
    });
  }

  // Handle filter changes
  const handleStatusChange = (newStatus: 'all' | 'pending' | 'completed') => {
    setStatusFilter(newStatus);
    if (onFilterChange) {
      onFilterChange(newStatus, undefined);
    }
  };

  const handleSortChange = (newSort: 'created' | 'title') => {
    setSortFilter(newSort);
    if (onFilterChange) {
      onFilterChange(undefined, newSort);
    }
  };

  // Show loading skeletons when tasks are loading
  if (isLoading && filteredTasks.length === 0) {
    return (
      <div className="space-y-4">
        <FilterBar
          statusFilter={statusFilter}
          sortFilter={sortFilter}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        statusFilter={statusFilter}
        sortFilter={sortFilter}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              refetchTasks={refetchTasks}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No tasks match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
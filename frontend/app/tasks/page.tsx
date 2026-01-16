'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusCircleIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskList } from '@/components/TaskList';
import { EmptyState } from '@/components/EmptyState';
import { TaskModal } from '@/components/TaskModal';
import { useTasks } from '@/lib/queries';
import { authUtils, useSession } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession(); // This returns { user, isLoading, isError }

  useEffect(() => {
    if (session.user && session.user.user_id) {
      setUserId(session.user.user_id);
    } else if (!session.isLoading) {
      // If session is loaded but no user, try to get from auth utils
      const id = authUtils.getCurrentUserId();
      if (id) {
        setUserId(id);
      }
    }
  }, [session]);

  // Get filter and sort parameters from URL
  const statusParam = searchParams.get('status') as 'all' | 'pending' | 'completed' | null;
  const sortParam = searchParams.get('sort') as 'created' | 'title' | null;

  const statusFilter = statusParam || 'all';
  const sortFilter = sortParam || 'created';

  const { data: tasks, isLoading, isError, refetch } = useTasks(userId || '', statusFilter, sortFilter);

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Setting up your account...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading tasks</p>
          <button
            onClick={() => refetch()}
            className="text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  // Update URL with filter and sort parameters
  const updateFilters = (newStatus?: 'all' | 'pending' | 'completed', newSort?: 'created' | 'title') => {
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus) {
      params.set('status', newStatus);
    } else if (statusParam) {
      params.delete('status');
    }

    if (newSort) {
      params.set('sort', newSort);
    } else if (sortParam) {
      params.delete('sort');
    }

    router.replace(`/tasks${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <Button onClick={handleCreateTask}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {tasks && tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            refetchTasks={refetch}
            initialStatusFilter={statusFilter}
            initialSortFilter={sortFilter}
            onFilterChange={updateFilters}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <TaskList
            tasks={[]}
            onEdit={handleEditTask}
            refetchTasks={refetch}
            initialStatusFilter={statusFilter}
            initialSortFilter={sortFilter}
            onFilterChange={updateFilters}
            isLoading={true}
          />
        ) : (
          <EmptyState onCreateTask={handleCreateTask} />
        )}

        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentTask(null);
            }}
            task={currentTask}
            userId={userId}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
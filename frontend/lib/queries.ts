import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { apiClient } from './api';

// Query keys
const QUERY_KEYS = {
  tasks: (userId: string, status?: 'all' | 'pending' | 'completed', sort?: 'created' | 'title') =>
    ['tasks', userId, status, sort] as const,
  task: (userId: string, taskId: string) => ['task', userId, taskId] as const,
};

// Task-related queries and mutations
export const useTasks = (userId: string, status?: 'all' | 'pending' | 'completed', sort?: 'created' | 'title') => {
  return useQuery({
    queryKey: QUERY_KEYS.tasks(userId, status, sort),
    queryFn: () => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      return apiClient.getTasks(userId, status, sort).then(res => res.data);
    },
    enabled: !!userId && userId !== 'undefined',
  });
};

export const useTask = (userId: string, taskId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.task(userId, taskId),
    queryFn: () => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      if (!taskId || taskId === 'undefined') {
        throw new Error('Task ID is required and cannot be undefined');
      }
      return apiClient.getTask(userId, taskId).then(res => res.data);
    },
    enabled: !!userId && userId !== 'undefined' && !!taskId && taskId !== 'undefined',
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, taskData }: { userId: string; taskData: CreateTaskRequest }) => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      return apiClient.createTask(userId, taskData).then(res => res.data);
    },
    onSuccess: (newTask, variables) => {
      // Invalidate and refetch the tasks query to reflect the new task
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks(variables.userId) });

      // Also invalidate all task queries for this user to ensure freshness
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.userId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, taskId, taskData }: { userId: string; taskId: string; taskData: UpdateTaskRequest }) => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      if (!taskId || taskId === 'undefined') {
        throw new Error('Task ID is required and cannot be undefined');
      }
      return apiClient.updateTask(userId, taskId, taskData).then(res => res.data);
    },
    onSuccess: (_, variables) => {
      // Update the specific task query and invalidate the tasks list
      queryClient.setQueryData(QUERY_KEYS.task(variables.userId, variables.taskId), variables.taskData);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks(variables.userId) });

      // Also invalidate all task queries for this user to ensure freshness
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.userId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, taskId }: { userId: string; taskId: string }) => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      if (!taskId || taskId === 'undefined') {
        throw new Error('Task ID is required and cannot be undefined');
      }
      return apiClient.deleteTask(userId, taskId).then(res => res.data);
    },
    onSuccess: (_, variables) => {
      // Remove the specific task from the cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.task(variables.userId, variables.taskId) });

      // Invalidate all tasks queries for this user regardless of status and sort parameters
      // This ensures that any cached version of the user's tasks is refreshed
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) &&
                 queryKey[0] === 'tasks' &&
                 queryKey[1] === variables.userId;
        }
      });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, taskId }: { userId: string; taskId: string }) => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      if (!taskId || taskId === 'undefined') {
        throw new Error('Task ID is required and cannot be undefined');
      }
      return apiClient.toggleTaskCompletion(userId, taskId).then(res => res.data);
    },
    onMutate: async ({ userId, taskId }) => {
      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required and cannot be undefined');
      }
      if (!taskId || taskId === 'undefined') {
        throw new Error('Task ID is required and cannot be undefined');
      }

      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.task(userId, taskId) });

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData<Task>(QUERY_KEYS.task(userId, taskId));

      // Optimistically update the cache
      if (previousTask) {
        queryClient.setQueryData<Task>(QUERY_KEYS.task(userId, taskId), {
          ...previousTask,
          completed: !previousTask.completed,
        });
      }

      // Also update in the tasks list if it exists
      const tasksQueryKey = QUERY_KEYS.tasks(userId);
      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey);
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(tasksQueryKey,
          previousTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      }

      return { previousTask };
    },
    onError: (err, variables, context) => {
      // Rollback the optimistic update if mutation fails
      if (context?.previousTask) {
        queryClient.setQueryData(QUERY_KEYS.task(variables.userId, variables.taskId), context.previousTask);
      }
    },
    onSuccess: (updatedTask, variables) => {
      // Update the specific task query with the actual server response
      queryClient.setQueryData(QUERY_KEYS.task(variables.userId, variables.taskId), updatedTask);

      // Update the tasks list with the actual server response
      const tasksQueryKey = QUERY_KEYS.tasks(variables.userId);
      const currentTasks = queryClient.getQueryData<Task[]>(tasksQueryKey);
      if (currentTasks) {
        queryClient.setQueryData<Task[]>(tasksQueryKey,
          currentTasks.map(task =>
            task.id === variables.taskId ? updatedTask : task
          )
        );
      }

      // Force refresh of the tasks list to ensure UI updates immediately
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.userId] });
    },
  });
};
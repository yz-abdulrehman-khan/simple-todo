import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskCounts, PaginationParams } from '@/types';
import { taskService } from '@/services';
import { getErrorMessage } from '@/helpers';

interface UseTasksReturn {
  tasks: Task[];
  counts: TaskCounts;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchTasksOnly: () => Promise<void>;
}

export const useTasks = (paginationParams: PaginationParams): UseTasksReturn => {
  const { page, limit } = paginationParams;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [counts, setCounts] = useState<TaskCounts>({
    uncompleted: 0,
    completed: 0,
    deleted: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tasksData, countsData] = await Promise.all([
        taskService.getTasks({ page, limit }),
        taskService.getCounts(),
      ]);

      setTasks(tasksData);
      setCounts(countsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  const fetchTasksOnly = useCallback(async () => {
    setError(null);
    try {
      const [tasksData, countsData] = await Promise.all([
        taskService.getTasks({ page, limit }),
        taskService.getCounts(),
      ]);
      setTasks(tasksData);
      setCounts(countsData);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [page, limit]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    counts,
    isLoading,
    error,
    refetch: fetchTasks,
    refetchTasksOnly: fetchTasksOnly,
  };
};

import { useState, useCallback } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';
import { taskService } from '@/services';
import { getErrorMessage } from '@/utils';

interface UseTaskMutationsReturn {
  createTask: (data: CreateTaskDto) => Promise<Task | null>;
  updateTask: (id: number, data: UpdateTaskDto) => Promise<Task | null>;
  toggleTaskCompletion: (id: number, completed: boolean) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<Task | null>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

export const useTaskMutations = (): UseTaskMutationsReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (data: CreateTaskDto): Promise<Task | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const newTask = await taskService.createTask(data);
      return newTask;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, data: UpdateTaskDto): Promise<Task | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedTask = await taskService.updateTask(id, data);
      return updatedTask;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const toggleTaskCompletion = useCallback(
    async (id: number, completed: boolean): Promise<Task | null> => {
      setIsUpdating(true);
      setError(null);

      try {
        const updatedTask = await taskService.patchTask(id, { completed });
        return updatedTask;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: number): Promise<Task | null> => {
    setIsDeleting(true);
    setError(null);

    try {
      const deletedTask = await taskService.deleteTask(id);
      return deletedTask;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    error,
  };
};

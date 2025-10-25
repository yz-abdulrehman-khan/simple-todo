import { useState, useEffect, useCallback } from 'react';
import type { TaskCounts } from '@/types';

interface UseOptimisticCountsReturn {
  localCounts: TaskCounts;
  withOptimisticUpdate: <T>(
    updateCounts: (prev: TaskCounts) => TaskCounts,
    action: () => Promise<T>,
    onSuccess?: () => void | Promise<void>
  ) => Promise<T | null>;
}

export const useOptimisticCounts = (counts: TaskCounts): UseOptimisticCountsReturn => {
  const [localCounts, setLocalCounts] = useState<TaskCounts>(counts);

  useEffect(() => {
    setLocalCounts(counts);
  }, [counts]);

  const withOptimisticUpdate = useCallback(
    async <T>(
      updateCounts: (prev: TaskCounts) => TaskCounts,
      action: () => Promise<T>,
      onSuccess?: () => void | Promise<void>
    ): Promise<T | null> => {
      const previousCounts = { ...localCounts };
      setLocalCounts(updateCounts);

      const result = await action();
      if (result) {
        await onSuccess?.();
        return result;
      }

      setLocalCounts(previousCounts);
      return null;
    },
    [localCounts]
  );

  return { localCounts, withOptimisticUpdate };
};

import { renderHook, act } from '@testing-library/react';
import { useOptimisticCounts } from './use-optimistic-counts';
import type { TaskCounts } from '@/types';

describe('useOptimisticCounts', () => {
  const initialCounts: TaskCounts = {
    uncompleted: 5,
    completed: 3,
    deleted: 2,
  };

  it('should initialize with provided counts', () => {
    const { result } = renderHook(() => useOptimisticCounts(initialCounts));

    expect(result.current.localCounts).toEqual(initialCounts);
  });

  it('should update local counts when server counts change', () => {
    const { result, rerender } = renderHook(({ counts }) => useOptimisticCounts(counts), {
      initialProps: { counts: initialCounts },
    });

    const newCounts: TaskCounts = {
      uncompleted: 10,
      completed: 5,
      deleted: 3,
    };

    rerender({ counts: newCounts });

    expect(result.current.localCounts).toEqual(newCounts);
  });

  describe('withOptimisticUpdate', () => {
    it('should apply optimistic update immediately', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue({ success: true });

      act(() => {
        result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      // Optimistic update should be applied immediately
      expect(result.current.localCounts).toEqual({
        uncompleted: 6,
        completed: 3,
        deleted: 2,
      });
    });

    it('should keep optimistic update when action succeeds', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue({ success: true });

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(result.current.localCounts).toEqual({
        uncompleted: 6,
        completed: 3,
        deleted: 2,
      });
    });

    it('should rollback when action returns null', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(null);

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      // Should rollback to original counts
      expect(result.current.localCounts).toEqual(initialCounts);
    });

    it('should rollback when action returns undefined', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(undefined);

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(result.current.localCounts).toEqual(initialCounts);
    });

    it('should rollback when action returns false', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(false);

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(result.current.localCounts).toEqual(initialCounts);
    });

    it('should rollback when action returns 0', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(0);

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(result.current.localCounts).toEqual(initialCounts);
    });

    it('should call onSuccess when action succeeds', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue({ success: true });
      const onSuccess = jest.fn();

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action,
          onSuccess
        );
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should not call onSuccess when action fails', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(null);
      const onSuccess = jest.fn();

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action,
          onSuccess
        );
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should return action result on success', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const actionResult = { id: 123, success: true };
      const action = jest.fn().mockResolvedValue(actionResult);

      let returnValue: { id: number; success: boolean } | null = null;
      await act(async () => {
        returnValue = await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(returnValue).toEqual(actionResult);
    });

    it('should return null on failure', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue(null);

      let returnValue: null = null;
      await act(async () => {
        returnValue = await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action
        );
      });

      expect(returnValue).toBeNull();
    });

    it('should handle async onSuccess callback', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue({ success: true });
      const onSuccess = jest.fn().mockResolvedValue(undefined);

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action,
          onSuccess
        );
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle multiple sequential updates', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action1 = jest.fn().mockResolvedValue({ success: true });
      const action2 = jest.fn().mockResolvedValue({ success: true });

      // First update: increment uncompleted
      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted + 1 }),
          action1
        );
      });

      expect(result.current.localCounts.uncompleted).toBe(6);

      // Second update: decrement uncompleted
      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({ ...prev, uncompleted: prev.uncompleted - 1 }),
          action2
        );
      });

      expect(result.current.localCounts.uncompleted).toBe(5);
    });

    it('should handle complex count changes', async () => {
      const { result } = renderHook(() => useOptimisticCounts(initialCounts));

      const action = jest.fn().mockResolvedValue({ success: true });

      await act(async () => {
        await result.current.withOptimisticUpdate(
          (prev) => ({
            uncompleted: prev.uncompleted - 1,
            completed: prev.completed + 1,
            deleted: prev.deleted,
          }),
          action
        );
      });

      expect(result.current.localCounts).toEqual({
        uncompleted: 4,
        completed: 4,
        deleted: 2,
      });
    });
  });
});

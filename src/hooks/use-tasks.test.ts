import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks } from './use-tasks';
import { taskService } from '@/services';
import type { Task, TaskCounts } from '@/types';

// Mock Response class for error handling
class MockResponse {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string) {
    this.status = status;
    this.statusText = statusText;
  }
}

global.Response = MockResponse as unknown as typeof Response;

// Mock task service
jest.mock('@/services');

const mockTaskService = taskService as jest.Mocked<typeof taskService>;

describe('useTasks', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      text: 'Task 1',
      completed: false,
      deleted: false,
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      text: 'Task 2',
      completed: true,
      deleted: false,
      createdAt: '2024-01-02T10:00:00Z',
    },
  ];

  const mockCounts: TaskCounts = {
    uncompleted: 5,
    completed: 3,
    deleted: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', async () => {
    mockTaskService.getTasks.mockResolvedValue([]);
    mockTaskService.getCounts.mockResolvedValue({ uncompleted: 0, completed: 0, deleted: 0 });

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    // Initial state before async operations complete
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for async operations to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.counts).toEqual({ uncompleted: 0, completed: 0, deleted: 0 });
  });

  it('should fetch tasks and counts on mount', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockTaskService.getTasks).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(mockTaskService.getCounts).toHaveBeenCalled();
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.counts).toEqual(mockCounts);
    expect(result.current.error).toBeNull();
  });

  it('should update when pagination params change', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result, rerender } = renderHook(({ page, limit }) => useTasks({ page, limit }), {
      initialProps: { page: 1, limit: 10 },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    jest.clearAllMocks();

    // Change pagination params
    rerender({ page: 2, limit: 20 });

    await waitFor(() => {
      expect(mockTaskService.getTasks).toHaveBeenCalledWith({ page: 2, limit: 20 });
    });
  });

  it('should handle errors during fetch', async () => {
    mockTaskService.getTasks.mockRejectedValue(new Error('Network error'));
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tasks).toEqual([]);
  });

  it('should handle errors from getCounts', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockRejectedValue(new Error('Counts error'));

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.error).toBe('Counts error');
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should refetch both tasks and counts', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    jest.clearAllMocks();

    const newTasks = [
      ...mockTasks,
      {
        id: 3,
        text: 'Task 3',
        completed: false,
        deleted: false,
        createdAt: '2024-01-03T10:00:00Z',
      },
    ];
    const newCounts = { uncompleted: 6, completed: 3, deleted: 2 };

    mockTaskService.getTasks.mockResolvedValue(newTasks);
    mockTaskService.getCounts.mockResolvedValue(newCounts);

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockTaskService.getTasks).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(mockTaskService.getCounts).toHaveBeenCalled();
    expect(result.current.tasks).toEqual(newTasks);
    expect(result.current.counts).toEqual(newCounts);
  });

  it('should refetch only tasks when refetchTasksOnly is called', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    jest.clearAllMocks();

    const newTasks = [
      {
        id: 4,
        text: 'Task 4',
        completed: false,
        deleted: false,
        createdAt: '2024-01-04T10:00:00Z',
      },
    ];

    mockTaskService.getTasks.mockResolvedValue(newTasks);

    await act(async () => {
      await result.current.refetchTasksOnly();
    });

    expect(mockTaskService.getTasks).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(mockTaskService.getCounts).not.toHaveBeenCalled();
    expect(result.current.tasks).toEqual(newTasks);
    expect(result.current.counts).toEqual(mockCounts); // Counts should not change
  });

  it('should handle errors during refetchTasksOnly', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockTaskService.getTasks.mockRejectedValue(new Error('Refetch error'));

    await act(async () => {
      await result.current.refetchTasksOnly();
    });

    expect(result.current.error).toBe('Refetch error');
    expect(result.current.tasks).toEqual(mockTasks); // Tasks should remain unchanged
  });

  it('should set loading state during refetch', async () => {
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let resolveGetTasks: (value: Task[]) => void;
    let resolveGetCounts: (value: TaskCounts) => void;

    const tasksPromise = new Promise<Task[]>((resolve) => {
      resolveGetTasks = resolve;
    });
    const countsPromise = new Promise<TaskCounts>((resolve) => {
      resolveGetCounts = resolve;
    });

    mockTaskService.getTasks.mockReturnValue(tasksPromise);
    mockTaskService.getCounts.mockReturnValue(countsPromise);

    let refetchPromise: Promise<void>;
    act(() => {
      refetchPromise = result.current.refetch();
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Resolve promises
    resolveGetTasks!(mockTasks);
    resolveGetCounts!(mockCounts);

    await act(async () => {
      await refetchPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should clear error on successful refetch', async () => {
    mockTaskService.getTasks.mockRejectedValue(new Error('Initial error'));
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    const { result } = renderHook(() => useTasks({ page: 1, limit: 10 }));

    await waitFor(() => {
      expect(result.current.error).toBe('Initial error');
    });

    // Now make refetch succeed
    mockTaskService.getTasks.mockResolvedValue(mockTasks);
    mockTaskService.getCounts.mockResolvedValue(mockCounts);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.tasks).toEqual(mockTasks);
  });
});

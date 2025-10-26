import { renderHook, act } from '@testing-library/react';
import { useTaskMutations } from './use-task-mutations';
import { taskService } from '@/services';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

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

describe('useTaskMutations', () => {
  const mockTask: Task = {
    id: 1,
    text: 'Test task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTaskMutations());

    expect(result.current.isCreating).toBe(false);
    expect(result.current.isUpdating).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const createData: CreateTaskDto = { text: 'New task' };
      const createdTask = { ...mockTask, text: 'New task' };

      mockTaskService.createTask.mockResolvedValue(createdTask);

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.createTask(createData);
      });

      expect(mockTaskService.createTask).toHaveBeenCalledWith(createData);
      expect(returnedTask).toEqual(createdTask);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set isCreating to true during creation', async () => {
      const createData: CreateTaskDto = { text: 'New task' };
      let resolveCreate: (value: Task) => void;

      const createPromise = new Promise<Task>((resolve) => {
        resolveCreate = resolve;
      });

      mockTaskService.createTask.mockReturnValue(createPromise);

      const { result } = renderHook(() => useTaskMutations());

      let createTaskPromise: Promise<Task | null>;
      act(() => {
        createTaskPromise = result.current.createTask(createData);
      });

      // Should be creating
      expect(result.current.isCreating).toBe(true);

      // Resolve
      resolveCreate!(mockTask);

      await act(async () => {
        await createTaskPromise;
      });

      expect(result.current.isCreating).toBe(false);
    });

    it('should handle create errors', async () => {
      const createData: CreateTaskDto = { text: 'New task' };

      mockTaskService.createTask.mockRejectedValue(new Error('Create failed'));

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.createTask(createData);
      });

      expect(returnedTask).toBeNull();
      expect(result.current.error).toBe('Create failed');
      expect(result.current.isCreating).toBe(false);
    });

    it('should clear error before creating', async () => {
      const createData: CreateTaskDto = { text: 'New task' };

      // First create fails
      mockTaskService.createTask.mockRejectedValue(new Error('First error'));

      const { result } = renderHook(() => useTaskMutations());

      await act(async () => {
        await result.current.createTask(createData);
      });

      expect(result.current.error).toBe('First error');

      // Second create succeeds
      mockTaskService.createTask.mockResolvedValue(mockTask);

      await act(async () => {
        await result.current.createTask(createData);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData: UpdateTaskDto = { text: 'Updated task', completed: true };
      const updatedTask = { ...mockTask, ...updateData };

      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.updateTask(1, updateData);
      });

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, updateData);
      expect(returnedTask).toEqual(updatedTask);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set isUpdating to true during update', async () => {
      const updateData: UpdateTaskDto = { text: 'Updated task' };
      let resolveUpdate: (value: Task) => void;

      const updatePromise = new Promise<Task>((resolve) => {
        resolveUpdate = resolve;
      });

      mockTaskService.updateTask.mockReturnValue(updatePromise);

      const { result } = renderHook(() => useTaskMutations());

      let updateTaskPromise: Promise<Task | null>;
      act(() => {
        updateTaskPromise = result.current.updateTask(1, updateData);
      });

      expect(result.current.isUpdating).toBe(true);

      resolveUpdate!(mockTask);

      await act(async () => {
        await updateTaskPromise;
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('should handle update errors', async () => {
      const updateData: UpdateTaskDto = { text: 'Updated task' };

      mockTaskService.updateTask.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.updateTask(1, updateData);
      });

      expect(returnedTask).toBeNull();
      expect(result.current.error).toBe('Update failed');
      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion successfully', async () => {
      const toggledTask = { ...mockTask, completed: true };

      mockTaskService.patchTask.mockResolvedValue(toggledTask);

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.toggleTaskCompletion(1, true);
      });

      expect(mockTaskService.patchTask).toHaveBeenCalledWith(1, { completed: true });
      expect(returnedTask).toEqual(toggledTask);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should toggle to false', async () => {
      const toggledTask = { ...mockTask, completed: false };

      mockTaskService.patchTask.mockResolvedValue(toggledTask);

      const { result } = renderHook(() => useTaskMutations());

      await act(async () => {
        await result.current.toggleTaskCompletion(1, false);
      });

      expect(mockTaskService.patchTask).toHaveBeenCalledWith(1, { completed: false });
    });

    it('should set isUpdating to true during toggle', async () => {
      let resolveToggle: (value: Task) => void;

      const togglePromise = new Promise<Task>((resolve) => {
        resolveToggle = resolve;
      });

      mockTaskService.patchTask.mockReturnValue(togglePromise);

      const { result } = renderHook(() => useTaskMutations());

      let togglePromiseResult: Promise<Task | null>;
      act(() => {
        togglePromiseResult = result.current.toggleTaskCompletion(1, true);
      });

      expect(result.current.isUpdating).toBe(true);

      resolveToggle!(mockTask);

      await act(async () => {
        await togglePromiseResult;
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('should handle toggle errors', async () => {
      mockTaskService.patchTask.mockRejectedValue(new Error('Toggle failed'));

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.toggleTaskCompletion(1, true);
      });

      expect(returnedTask).toBeNull();
      expect(result.current.error).toBe('Toggle failed');
      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const deletedTask = { ...mockTask, deleted: true };

      mockTaskService.deleteTask.mockResolvedValue(deletedTask);

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.deleteTask(1);
      });

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
      expect(returnedTask).toEqual(deletedTask);
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set isDeleting to true during deletion', async () => {
      let resolveDelete: (value: Task) => void;

      const deletePromise = new Promise<Task>((resolve) => {
        resolveDelete = resolve;
      });

      mockTaskService.deleteTask.mockReturnValue(deletePromise);

      const { result } = renderHook(() => useTaskMutations());

      let deleteTaskPromise: Promise<Task | null>;
      act(() => {
        deleteTaskPromise = result.current.deleteTask(1);
      });

      expect(result.current.isDeleting).toBe(true);

      resolveDelete!(mockTask);

      await act(async () => {
        await deleteTaskPromise;
      });

      expect(result.current.isDeleting).toBe(false);
    });

    it('should handle delete errors', async () => {
      mockTaskService.deleteTask.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useTaskMutations());

      let returnedTask: Task | null = null;
      await act(async () => {
        returnedTask = await result.current.deleteTask(1);
      });

      expect(returnedTask).toBeNull();
      expect(result.current.error).toBe('Delete failed');
      expect(result.current.isDeleting).toBe(false);
    });
  });

  it('should have stable function references', () => {
    const { result, rerender } = renderHook(() => useTaskMutations());

    const {
      createTask: createTask1,
      updateTask: updateTask1,
      toggleTaskCompletion: toggle1,
      deleteTask: deleteTask1,
    } = result.current;

    rerender();

    const {
      createTask: createTask2,
      updateTask: updateTask2,
      toggleTaskCompletion: toggle2,
      deleteTask: deleteTask2,
    } = result.current;

    expect(createTask1).toBe(createTask2);
    expect(updateTask1).toBe(updateTask2);
    expect(toggle1).toBe(toggle2);
    expect(deleteTask1).toBe(deleteTask2);
  });
});

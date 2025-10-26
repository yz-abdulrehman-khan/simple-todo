import { taskService } from './task-service';
import { httpClient } from '../http-client';
import type { Task, CreateTaskDto, UpdateTaskDto, PaginationParams } from '@/types';

// Mock the http client
jest.mock('../http-client');

const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTask: Task = {
    id: 1,
    text: 'Test task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  };

  describe('getTasks', () => {
    it('should fetch tasks with pagination params', async () => {
      const mockTasks = [mockTask];
      const params: PaginationParams = { page: 1, limit: 10 };

      mockHttpClient.get.mockResolvedValue(mockTasks);

      const result = await taskService.getTasks(params);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/tasks', {
        _page: 1,
        _limit: 10,
        deleted: false,
      });
      expect(result).toEqual(mockTasks);
    });

    it('should fetch tasks with different pagination params', async () => {
      const params: PaginationParams = { page: 3, limit: 20 };

      mockHttpClient.get.mockResolvedValue([]);

      await taskService.getTasks(params);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/tasks', {
        _page: 3,
        _limit: 20,
        deleted: false,
      });
    });
  });

  describe('getTaskById', () => {
    it('should fetch task by ID', async () => {
      mockHttpClient.get.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTask);
    });

    it('should fetch task with different ID', async () => {
      const task = { ...mockTask, id: 42 };
      mockHttpClient.get.mockResolvedValue(task);

      const result = await taskService.getTaskById(42);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/tasks/42');
      expect(result).toEqual(task);
    });
  });

  describe('createTask', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create task with default values', async () => {
      const createData: CreateTaskDto = { text: 'New task' };
      const createdTask = { ...mockTask, text: 'New task' };

      mockHttpClient.post.mockResolvedValue(createdTask);

      const result = await taskService.createTask(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/tasks', {
        text: 'New task',
        completed: false,
        deleted: false,
        createdAt: '2024-01-15T12:00:00.000Z',
      });
      expect(result).toEqual(createdTask);
    });

    it('should create task with completed flag', async () => {
      const createData: CreateTaskDto = { text: 'Completed task', completed: true };
      const createdTask = { ...mockTask, text: 'Completed task', completed: true };

      mockHttpClient.post.mockResolvedValue(createdTask);

      await taskService.createTask(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/tasks', {
        text: 'Completed task',
        completed: true,
        deleted: false,
        createdAt: '2024-01-15T12:00:00.000Z',
      });
    });

    it('should create task with deleted flag', async () => {
      const createData: CreateTaskDto = { text: 'Deleted task', deleted: true };

      mockHttpClient.post.mockResolvedValue(mockTask);

      await taskService.createTask(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/tasks', {
        text: 'Deleted task',
        completed: false,
        deleted: true,
        createdAt: '2024-01-15T12:00:00.000Z',
      });
    });

    it('should create task with all flags', async () => {
      const createData: CreateTaskDto = {
        text: 'All flags task',
        completed: true,
        deleted: true,
      };

      mockHttpClient.post.mockResolvedValue(mockTask);

      await taskService.createTask(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/tasks', {
        text: 'All flags task',
        completed: true,
        deleted: true,
        createdAt: '2024-01-15T12:00:00.000Z',
      });
    });
  });

  describe('updateTask', () => {
    it('should update task with full data', async () => {
      const updateData: UpdateTaskDto = {
        text: 'Updated task',
        completed: true,
      };
      const updatedTask = { ...mockTask, ...updateData };

      mockHttpClient.put.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/tasks/1', updateData);
      expect(result).toEqual(updatedTask);
    });

    it('should update task text only', async () => {
      const updateData: UpdateTaskDto = { text: 'New text' };

      mockHttpClient.put.mockResolvedValue(mockTask);

      await taskService.updateTask(1, updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/tasks/1', updateData);
    });
  });

  describe('patchTask', () => {
    it('should patch task with partial data', async () => {
      const patchData = { completed: true };
      const patchedTask = { ...mockTask, completed: true };

      mockHttpClient.patch.mockResolvedValue(patchedTask);

      const result = await taskService.patchTask(1, patchData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/tasks/1', patchData);
      expect(result).toEqual(patchedTask);
    });

    it('should patch task text', async () => {
      const patchData = { text: 'Patched text' };

      mockHttpClient.patch.mockResolvedValue(mockTask);

      await taskService.patchTask(1, patchData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/tasks/1', patchData);
    });

    it('should patch deleted flag', async () => {
      const patchData = { deleted: true };

      mockHttpClient.patch.mockResolvedValue(mockTask);

      await taskService.patchTask(1, patchData);

      expect(mockHttpClient.patch).toHaveBeenCalledWith('/tasks/1', patchData);
    });
  });

  describe('deleteTask', () => {
    it('should delete task by ID', async () => {
      const deletedTask = { ...mockTask, deleted: true };

      mockHttpClient.delete.mockResolvedValue(deletedTask);

      const result = await taskService.deleteTask(1);

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(deletedTask);
    });

    it('should delete task with different ID', async () => {
      mockHttpClient.delete.mockResolvedValue(mockTask);

      await taskService.deleteTask(99);

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/tasks/99');
    });
  });

  describe('getCounts', () => {
    it('should fetch counts for all task types', async () => {
      const uncompletedTasks = [
        { ...mockTask, id: 1, completed: false, deleted: false },
        { ...mockTask, id: 2, completed: false, deleted: false },
      ];
      const completedTasks = [{ ...mockTask, id: 3, completed: true, deleted: false }];
      const deletedTasks = [{ ...mockTask, id: 4, deleted: true }];

      mockHttpClient.get
        .mockResolvedValueOnce(uncompletedTasks)
        .mockResolvedValueOnce(completedTasks)
        .mockResolvedValueOnce(deletedTasks);

      const result = await taskService.getCounts();

      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
      expect(mockHttpClient.get).toHaveBeenNthCalledWith(1, '/tasks', {
        deleted: false,
        completed: false,
      });
      expect(mockHttpClient.get).toHaveBeenNthCalledWith(2, '/tasks', {
        deleted: false,
        completed: true,
      });
      expect(mockHttpClient.get).toHaveBeenNthCalledWith(3, '/tasks', { deleted: true });

      expect(result).toEqual({
        uncompleted: 2,
        completed: 1,
        deleted: 1,
      });
    });

    it('should handle empty counts', async () => {
      mockHttpClient.get
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await taskService.getCounts();

      expect(result).toEqual({
        uncompleted: 0,
        completed: 0,
        deleted: 0,
      });
    });

    it('should handle large counts', async () => {
      const manyTasks = Array(50)
        .fill(null)
        .map((_, i) => ({ ...mockTask, id: i }));

      mockHttpClient.get
        .mockResolvedValueOnce(manyTasks)
        .mockResolvedValueOnce(manyTasks)
        .mockResolvedValueOnce(manyTasks);

      const result = await taskService.getCounts();

      expect(result).toEqual({
        uncompleted: 50,
        completed: 50,
        deleted: 50,
      });
    });
  });
});

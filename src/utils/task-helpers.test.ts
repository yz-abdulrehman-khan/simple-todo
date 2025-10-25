import {
  isTaskActive,
  isTaskCompleted,
  isTaskDeleted,
  filterTasksByStatus,
  calculateTaskCounts,
  sortTasksByDate,
} from './task-helpers';
import type { Task } from '@/types';

const mockTasks: Task[] = [
  {
    id: 1,
    text: 'Active task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    text: 'Completed task',
    completed: true,
    deleted: false,
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 3,
    text: 'Deleted task',
    completed: false,
    deleted: true,
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: 4,
    text: 'Completed and deleted',
    completed: true,
    deleted: true,
    createdAt: '2024-01-04T10:00:00Z',
  },
];

describe('task-helpers', () => {
  describe('isTaskActive', () => {
    it('should return true for active tasks', () => {
      expect(isTaskActive(mockTasks[0]!)).toBe(true);
    });

    it('should return false for completed tasks', () => {
      expect(isTaskActive(mockTasks[1]!)).toBe(false);
    });

    it('should return false for deleted tasks', () => {
      expect(isTaskActive(mockTasks[2]!)).toBe(false);
    });
  });

  describe('isTaskCompleted', () => {
    it('should return true for completed tasks', () => {
      expect(isTaskCompleted(mockTasks[1]!)).toBe(true);
    });

    it('should return false for active tasks', () => {
      expect(isTaskCompleted(mockTasks[0]!)).toBe(false);
    });

    it('should return false for deleted tasks', () => {
      expect(isTaskCompleted(mockTasks[2]!)).toBe(false);
    });

    it('should return false for completed and deleted tasks', () => {
      expect(isTaskCompleted(mockTasks[3]!)).toBe(false);
    });
  });

  describe('isTaskDeleted', () => {
    it('should return true for deleted tasks', () => {
      expect(isTaskDeleted(mockTasks[2]!)).toBe(true);
      expect(isTaskDeleted(mockTasks[3]!)).toBe(true);
    });

    it('should return false for non-deleted tasks', () => {
      expect(isTaskDeleted(mockTasks[0]!)).toBe(false);
      expect(isTaskDeleted(mockTasks[1]!)).toBe(false);
    });
  });

  describe('filterTasksByStatus', () => {
    it('should filter active tasks', () => {
      const result = filterTasksByStatus(mockTasks, 'active');
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe(1);
    });

    it('should filter completed tasks', () => {
      const result = filterTasksByStatus(mockTasks, 'completed');
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe(2);
    });

    it('should filter deleted tasks', () => {
      const result = filterTasksByStatus(mockTasks, 'deleted');
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual([3, 4]);
    });

    it('should filter all non-deleted tasks', () => {
      const result = filterTasksByStatus(mockTasks, 'all');
      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toEqual([1, 2]);
    });

    it('should return empty array when no tasks match', () => {
      const emptyTasks: Task[] = [];
      expect(filterTasksByStatus(emptyTasks, 'active')).toEqual([]);
    });
  });

  describe('calculateTaskCounts', () => {
    it('should calculate counts correctly', () => {
      const result = calculateTaskCounts(mockTasks);
      expect(result).toEqual({
        uncompleted: 1,
        completed: 1,
        deleted: 2,
      });
    });

    it('should return zero counts for empty array', () => {
      const result = calculateTaskCounts([]);
      expect(result).toEqual({
        uncompleted: 0,
        completed: 0,
        deleted: 0,
      });
    });

    it('should handle all active tasks', () => {
      const activeTasks: Task[] = [
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
          completed: false,
          deleted: false,
          createdAt: '2024-01-02T10:00:00Z',
        },
      ];
      const result = calculateTaskCounts(activeTasks);
      expect(result).toEqual({
        uncompleted: 2,
        completed: 0,
        deleted: 0,
      });
    });
  });

  describe('sortTasksByDate', () => {
    it('should sort tasks by date in descending order by default', () => {
      const result = sortTasksByDate(mockTasks);
      expect(result.map((t) => t.id)).toEqual([4, 3, 2, 1]);
    });

    it('should sort tasks by date in ascending order', () => {
      const result = sortTasksByDate(mockTasks, 'asc');
      expect(result.map((t) => t.id)).toEqual([1, 2, 3, 4]);
    });

    it('should sort tasks by date in descending order explicitly', () => {
      const result = sortTasksByDate(mockTasks, 'desc');
      expect(result.map((t) => t.id)).toEqual([4, 3, 2, 1]);
    });

    it('should not mutate the original array', () => {
      const original = [...mockTasks];
      sortTasksByDate(mockTasks);
      expect(mockTasks).toEqual(original);
    });

    it('should handle empty array', () => {
      const result = sortTasksByDate([]);
      expect(result).toEqual([]);
    });
  });
});

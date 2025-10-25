import { getCountsAfterAdd, getCountsAfterToggle, getCountsAfterDelete } from './count-helpers';
import type { TaskCounts, Task } from '@/types';

describe('count-helpers', () => {
  describe('getCountsAfterAdd', () => {
    it('should increment uncompleted count by 1', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const result = getCountsAfterAdd(prevCounts);

      expect(result).toEqual({
        uncompleted: 6,
        completed: 3,
        deleted: 2,
      });
    });

    it('should not mutate the original counts object', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      getCountsAfterAdd(prevCounts);

      expect(prevCounts).toEqual({
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      });
    });
  });

  describe('getCountsAfterToggle', () => {
    it('should move count from uncompleted to completed when completing task', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const result = getCountsAfterToggle(prevCounts, true);

      expect(result).toEqual({
        uncompleted: 4,
        completed: 4,
        deleted: 2,
      });
    });

    it('should move count from completed to uncompleted when uncompleting task', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const result = getCountsAfterToggle(prevCounts, false);

      expect(result).toEqual({
        uncompleted: 6,
        completed: 2,
        deleted: 2,
      });
    });

    it('should not mutate the original counts object', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      getCountsAfterToggle(prevCounts, true);

      expect(prevCounts).toEqual({
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      });
    });
  });

  describe('getCountsAfterDelete', () => {
    it('should decrement uncompleted and increment deleted when deleting uncompleted task', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const task: Task = {
        id: 1,
        text: 'Test task',
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString(),
      };

      const result = getCountsAfterDelete(prevCounts, task);

      expect(result).toEqual({
        uncompleted: 4,
        completed: 3,
        deleted: 3,
      });
    });

    it('should decrement completed and increment deleted when deleting completed task', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const task: Task = {
        id: 1,
        text: 'Test task',
        completed: true,
        deleted: false,
        createdAt: new Date().toISOString(),
      };

      const result = getCountsAfterDelete(prevCounts, task);

      expect(result).toEqual({
        uncompleted: 5,
        completed: 2,
        deleted: 3,
      });
    });

    it('should not mutate the original counts object', () => {
      const prevCounts: TaskCounts = {
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      };

      const task: Task = {
        id: 1,
        text: 'Test task',
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString(),
      };

      getCountsAfterDelete(prevCounts, task);

      expect(prevCounts).toEqual({
        uncompleted: 5,
        completed: 3,
        deleted: 2,
      });
    });
  });
});

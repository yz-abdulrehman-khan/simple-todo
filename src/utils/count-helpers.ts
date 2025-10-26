import type { TaskCounts, Task } from '@/types';

export const getCountsAfterAdd = (prev: TaskCounts): TaskCounts => ({
  ...prev,
  uncompleted: prev.uncompleted + 1,
});

export const getCountsAfterToggle = (prev: TaskCounts, completed: boolean): TaskCounts => ({
  ...prev,
  uncompleted: completed ? prev.uncompleted - 1 : prev.uncompleted + 1,
  completed: completed ? prev.completed + 1 : prev.completed - 1,
});

export const getCountsAfterDelete = (prev: TaskCounts, task: Task): TaskCounts => ({
  ...prev,
  uncompleted: task.completed ? prev.uncompleted : prev.uncompleted - 1,
  completed: task.completed ? prev.completed - 1 : prev.completed,
  deleted: prev.deleted + 1,
});

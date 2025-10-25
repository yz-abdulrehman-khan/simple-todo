import type { Task, TaskFilter, TaskCounts } from '@/types';

export const isTaskActive = (task: Task): boolean => {
  return !task.completed && !task.deleted;
};

export const isTaskCompleted = (task: Task): boolean => {
  return task.completed && !task.deleted;
};

export const isTaskDeleted = (task: Task): boolean => {
  return task.deleted;
};

export const filterTasksByStatus = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(isTaskActive);
    case 'completed':
      return tasks.filter(isTaskCompleted);
    case 'deleted':
      return tasks.filter(isTaskDeleted);
    case 'all':
    default:
      return tasks.filter((task) => !task.deleted);
  }
};

export const calculateTaskCounts = (tasks: Task[]): TaskCounts => {
  return {
    uncompleted: tasks.filter(isTaskActive).length,
    completed: tasks.filter(isTaskCompleted).length,
    deleted: tasks.filter(isTaskDeleted).length,
  };
};

export const sortTasksByDate = (tasks: Task[], order: 'asc' | 'desc' = 'desc'): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

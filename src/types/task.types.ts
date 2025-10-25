export interface Task {
  id: number;
  text: string;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
}

export interface CreateTaskDto {
  text: string;
  completed?: boolean;
  deleted?: boolean;
}

export interface UpdateTaskDto {
  text?: string;
  completed?: boolean;
  deleted?: boolean;
}

export interface TaskCounts {
  uncompleted: number;
  completed: number;
  deleted: number;
}

export type TaskFilter = 'all' | 'active' | 'completed' | 'deleted';

import type { Task, CreateTaskDto, UpdateTaskDto, TaskCounts, PaginationParams } from '@/types';
import { API_ENDPOINTS } from '@/constants';
import { httpClient } from '../http-client';

export const taskService = {
  async getTasks(params: PaginationParams): Promise<Task[]> {
    return httpClient.get<Task[]>(API_ENDPOINTS.TASKS, {
      _page: params.page,
      _limit: params.limit,
      deleted: false,
    });
  },

  async getTaskById(id: number): Promise<Task> {
    return httpClient.get<Task>(API_ENDPOINTS.TASK_BY_ID(id));
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    const taskData = {
      ...data,
      completed: data.completed ?? false,
      deleted: data.deleted ?? false,
      createdAt: new Date().toISOString(),
    };
    return httpClient.post<Task>(API_ENDPOINTS.TASKS, taskData);
  },

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    return httpClient.put<Task>(API_ENDPOINTS.TASK_BY_ID(id), data);
  },

  async patchTask(id: number, data: Partial<UpdateTaskDto>): Promise<Task> {
    return httpClient.patch<Task>(API_ENDPOINTS.TASK_BY_ID(id), data);
  },

  async deleteTask(id: number): Promise<Task> {
    return httpClient.delete<Task>(API_ENDPOINTS.TASK_BY_ID(id));
  },

  async getCounts(): Promise<TaskCounts> {
    const [uncompletedTasks, completedTasks, deletedTasks] = await Promise.all([
      httpClient.get<Task[]>(API_ENDPOINTS.TASKS, { deleted: false, completed: false }),
      httpClient.get<Task[]>(API_ENDPOINTS.TASKS, { deleted: false, completed: true }),
      httpClient.get<Task[]>(API_ENDPOINTS.TASKS, { deleted: true }),
    ]);

    return {
      uncompleted: uncompletedTasks.length,
      completed: completedTasks.length,
      deleted: deletedTasks.length,
    };
  },
};

import { z } from 'zod';

export const createTaskSchema = z.object({
  text: z.string().trim().min(1, 'taskRequired').max(500, 'taskTooLong'),
  completed: z.boolean().optional().default(false),
  deleted: z.boolean().optional().default(false),
});

export const updateTaskSchema = z.object({
  text: z.string().trim().min(1, 'taskRequired').max(500, 'taskTooLong').optional(),
  completed: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

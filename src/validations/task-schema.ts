import { z } from 'zod';

export const createTaskSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text is required')
    .max(500, 'Task text must be less than 500 characters')
    .trim(),
  completed: z.boolean().optional().default(false),
  deleted: z.boolean().optional().default(false),
});

export const updateTaskSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text is required')
    .max(500, 'Task text must be less than 500 characters')
    .trim()
    .optional(),
  completed: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

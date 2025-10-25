import React from 'react';
import { Checkbox } from '@/components/ui';
import type { Task } from '@/types';
import { cn } from '@/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const handleDoubleClick = () => {
    if (!task.completed && !task.deleted) {
      onEdit(task);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
        disabled={task.deleted}
      />

      <div className="flex-1 min-w-0" onDoubleClick={handleDoubleClick}>
        <p
          className={cn(
            'text-base',
            task.completed && 'line-through text-gray-500',
            task.deleted && 'text-gray-400',
            !task.completed && !task.deleted && 'cursor-pointer'
          )}
        >
          {task.text}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {!task.completed && !task.deleted && (
          <button
            onClick={() => onEdit(task)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Delete task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

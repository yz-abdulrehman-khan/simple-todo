import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui';
import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const { t } = useTranslation('taskItem');
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
            aria-label={t('edit')}
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label={t('delete')}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

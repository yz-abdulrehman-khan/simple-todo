import React from 'react';
import { Button } from '@/components/ui';
import { TaskItem } from '../task-item/task-item';
import { cn, getPageNumbers } from '@/utils';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onToggleTask: (id: number, completed: boolean) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: Task) => void;
  onPageChange: (page: number) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  currentPage,
  totalPages,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onPageChange,
  canGoPrevious,
  canGoNext,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">No tasks found. Create one to get started!</div>
      </div>
    );
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>

          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    'min-w-[40px]',
                    currentPage === page &&
                      'border-purple-600 text-purple-600 bg-purple-50 hover:bg-purple-100'
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

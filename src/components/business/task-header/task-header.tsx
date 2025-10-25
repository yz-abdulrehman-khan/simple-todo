import React from 'react';
import { Button } from '@/components/ui';
import { TaskStats } from '../task-stats';
import type { TaskCounts } from '@/types';

interface TaskHeaderProps {
  counts: TaskCounts;
  onAddClick: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ counts, onAddClick }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <h1 className="text-2xl font-semibold text-gray-900">The Todo</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TaskStats counts={counts} />
          <Button onClick={onAddClick} className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Todo
          </Button>
        </div>
      </div>
    </header>
  );
};

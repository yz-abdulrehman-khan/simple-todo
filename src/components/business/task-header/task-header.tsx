import React from 'react';
import { Button } from '@/components/ui';
import { ClipboardCheck, Plus } from 'lucide-react';
import { TaskStats } from '../task-stats/task-stats';
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
            <ClipboardCheck className="w-8 h-8" />
            <h1 className="text-2xl font-semibold text-gray-900">The Todo</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TaskStats counts={counts} />
          <Button onClick={onAddClick} className="gap-2 bg-gray-900 text-white hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            Add Todo
          </Button>
        </div>
      </div>
    </header>
  );
};

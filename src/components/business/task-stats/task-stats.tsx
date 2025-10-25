import React from 'react';
import { Badge } from '@/components/ui';
import type { TaskCounts } from '@/types';

interface TaskStatsProps {
  counts: TaskCounts;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ counts }) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">
        {counts.uncompleted}
      </Badge>
      <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">
        {counts.deleted}
      </Badge>
      <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
        {counts.completed}
      </Badge>
    </div>
  );
};

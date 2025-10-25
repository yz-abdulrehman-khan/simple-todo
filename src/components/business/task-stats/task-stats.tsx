import React from 'react';
import { Badge } from '@/components/ui';
import type { TaskCounts } from '@/types';

interface TaskStatsProps {
  counts: TaskCounts;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ counts }) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
        {counts.uncompleted}
      </Badge>
      <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">
        {counts.completed}
      </Badge>
      <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
        {counts.deleted}
      </Badge>
    </div>
  );
};

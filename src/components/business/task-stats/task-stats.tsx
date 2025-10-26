import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import { formatNumber } from '@/utils';
import type { TaskCounts } from '@/types';

interface TaskStatsProps {
  counts: TaskCounts;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ counts }) => {
  const { t, i18n } = useTranslation('taskStats');

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="bg-purple-600 text-white hover:bg-purple-700 cursor-help"
        title={t('uncompleted')}
      >
        {formatNumber(counts.uncompleted, i18n.language)}
      </Badge>
      <Badge
        variant="secondary"
        className="bg-red-500 text-white hover:bg-red-600 cursor-help"
        title={t('deleted')}
      >
        {formatNumber(counts.deleted, i18n.language)}
      </Badge>
      <Badge
        variant="secondary"
        className="bg-green-500 text-white hover:bg-green-600 cursor-help"
        title={t('completed')}
      >
        {formatNumber(counts.completed, i18n.language)}
      </Badge>
    </div>
  );
};

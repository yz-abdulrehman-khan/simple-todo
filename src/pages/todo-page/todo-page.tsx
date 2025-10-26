import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { TaskHeader, TaskList, TaskModal } from '@/components/business';
import { useTasks, useTaskMutations, useModal } from '@/hooks';
import { PAGINATION_CONFIG } from '@/configs';
import { MODAL_MODE } from '@/constants';
import type { Task } from '@/types';

export const TodoPage: React.FC = () => {
  const { t } = useTranslation('todoPage');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.defaultPage);

  const { tasks, counts, isLoading, error, refetchTasksOnly } = useTasks({
    page: currentPage,
    limit: PAGINATION_CONFIG.defaultLimit,
  });

  const { createTask, updateTask, toggleTaskCompletion, deleteTask } = useTaskMutations();
  const { isOpen, mode, taskToEdit, openModal, closeModal } = useModal();

  const totalNonDeletedTasks = counts.uncompleted + counts.completed;
  const totalPages = Math.max(1, Math.ceil(totalNonDeletedTasks / PAGINATION_CONFIG.defaultLimit));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleModalSubmit = async (text: string) => {
    if (mode === MODAL_MODE.ADD) {
      await createTask({ text });
      await refetchTasksOnly();
    } else if (mode === MODAL_MODE.EDIT && taskToEdit) {
      await updateTask(taskToEdit.id, {
        text,
        completed: taskToEdit.completed,
        deleted: taskToEdit.deleted,
      });
      await refetchTasksOnly();
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await toggleTaskCompletion(id, completed);
    await refetchTasksOnly();
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    await refetchTasksOnly();
  };

  const handleRetry = () => {
    refetchTasksOnly();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskHeader counts={counts} onAddClick={() => openModal(MODAL_MODE.ADD)} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        {error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
              <p className="text-lg font-medium">{t('error')}</p>
              <p className="text-sm text-gray-600 mt-2">{t('errorDetails')}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {t('retry')}
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task: Task) => openModal(MODAL_MODE.EDIT, task)}
            onPageChange={setCurrentPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        )}
      </main>

      <TaskModal
        isOpen={isOpen}
        mode={mode}
        taskToEdit={taskToEdit}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskHeader, TaskList, TaskModal } from '@/components/business';
import { useTasks, useTaskMutations, useModal } from '@/hooks';
import { PAGINATION_CONFIG } from '@/configs';
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
    if (mode === 'add') {
      await createTask({ text });
      await refetchTasksOnly();
    } else if (mode === 'edit' && taskToEdit) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskHeader counts={counts} onAddClick={() => openModal('add')} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={(task: Task) => openModal('edit', task)}
          onPageChange={setCurrentPage}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
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

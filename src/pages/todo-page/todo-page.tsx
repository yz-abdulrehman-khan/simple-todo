import React, { useState, useEffect } from 'react';
import { TaskHeader, TaskList, TaskModal } from '@/components/business';
import { useTasks, useTaskMutations, usePagination, useModal, useOptimisticCounts } from '@/hooks';
import { getCountsAfterAdd, getCountsAfterToggle, getCountsAfterDelete } from '@/helpers';
import { PAGINATION_CONFIG } from '@/configs';
import type { Task } from '@/types';

export const TodoPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.defaultPage);

  const { tasks, counts, isLoading, error, refetchTasksOnly } = useTasks({
    page: currentPage,
    limit: PAGINATION_CONFIG.defaultLimit,
  });

  const { createTask, updateTask, toggleTaskCompletion, deleteTask } = useTaskMutations();
  const { isOpen, mode, taskToEdit, openModal, closeModal } = useModal();
  const { localCounts, withOptimisticUpdate } = useOptimisticCounts(counts);

  const totalNonDeletedTasks = localCounts.uncompleted + localCounts.completed;

  const { totalPages, goToPage, canGoPrevious, canGoNext } = usePagination({
    totalItems: totalNonDeletedTasks,
    initialPage: currentPage,
    itemsPerPage: PAGINATION_CONFIG.defaultLimit,
  });

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleModalSubmit = async (text: string) => {
    if (mode === 'add') {
      await withOptimisticUpdate(getCountsAfterAdd, () => createTask({ text }), refetchTasksOnly);
    } else if (mode === 'edit' && taskToEdit) {
      const result = await updateTask(taskToEdit.id, {
        text,
        completed: taskToEdit.completed,
        deleted: taskToEdit.deleted,
      });
      if (result) await refetchTasksOnly();
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await withOptimisticUpdate(
      (prev) => getCountsAfterToggle(prev, completed),
      () => toggleTaskCompletion(id, completed),
      refetchTasksOnly
    );
  };

  const handleDeleteTask = async (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    await withOptimisticUpdate(
      (prev) => getCountsAfterDelete(prev, taskToDelete),
      () => deleteTask(id),
      refetchTasksOnly
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskHeader counts={localCounts} onAddClick={() => openModal('add')} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={(task: Task) => openModal('edit', task)}
          onPageChange={(page: number) => {
            setCurrentPage(page);
            goToPage(page);
          }}
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

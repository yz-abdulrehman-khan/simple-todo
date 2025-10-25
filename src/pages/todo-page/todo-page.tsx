import React, { useState, useEffect } from 'react';
import { TaskHeader, TaskList, TaskModal } from '@/components/business';
import { useTasks, useTaskMutations, usePagination, useModal } from '@/hooks';
import { PAGINATION_CONFIG } from '@/configs';
import type { Task } from '@/types';

export const TodoPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.defaultPage);

  const { tasks, counts, isLoading, error, refetch } = useTasks({
    page: currentPage,
    limit: PAGINATION_CONFIG.defaultLimit,
  });

  const { createTask, updateTask, toggleTaskCompletion, deleteTask } = useTaskMutations();

  const { isOpen, mode, taskToEdit, openModal, closeModal } = useModal();

  const totalNonDeletedTasks = counts.uncompleted + counts.completed;

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

  const handleAddClick = () => {
    openModal('add');
  };

  const handleEditTask = (task: Task) => {
    openModal('edit', task);
  };

  const handleModalSubmit = async (text: string) => {
    if (mode === 'add') {
      const newTask = await createTask({ text });
      if (newTask) {
        await refetch();
      }
    } else if (mode === 'edit' && taskToEdit) {
      const updatedTask = await updateTask(taskToEdit.id, { text });
      if (updatedTask) {
        await refetch();
      }
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    const updatedTask = await toggleTaskCompletion(id, completed);
    if (updatedTask) {
      await refetch();
    }
  };

  const handleDeleteTask = async (id: number) => {
    const deletedTask = await deleteTask(id);
    if (deletedTask) {
      await refetch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
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
      <TaskHeader counts={counts} onAddClick={handleAddClick} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onPageChange={handlePageChange}
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

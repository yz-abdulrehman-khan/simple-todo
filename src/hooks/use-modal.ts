import { useState, useCallback } from 'react';
import type { ModalState, ModalMode, Task } from '@/types';

interface UseModalReturn extends ModalState {
  openModal: (mode: ModalMode, task?: Task) => void;
  closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'add',
    taskToEdit: null,
  });

  const openModal = useCallback((mode: ModalMode, task?: Task) => {
    setModalState({
      isOpen: true,
      mode,
      taskToEdit: task || null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      taskToEdit: null,
    });
  }, []);

  return {
    ...modalState,
    openModal,
    closeModal,
  };
};

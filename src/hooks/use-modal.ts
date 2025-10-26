import { useState, useCallback } from 'react';
import { MODAL_MODE } from '@/constants';
import type { ModalMode } from '@/types';

interface ModalState<T = unknown> {
  isOpen: boolean;
  mode: ModalMode;
  data: T | null;
}

interface UseModalReturn<T = unknown> extends ModalState<T> {
  openModal: (mode: ModalMode, data?: T) => void;
  closeModal: () => void;
}

export const useModal = <T = unknown>(): UseModalReturn<T> => {
  const [modalState, setModalState] = useState<ModalState<T>>({
    isOpen: false,
    mode: MODAL_MODE.ADD,
    data: null,
  });

  const openModal = useCallback((mode: ModalMode, data?: T) => {
    setModalState({
      isOpen: true,
      mode,
      data: data || null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: MODAL_MODE.ADD,
      data: null,
    });
  }, []);

  return {
    ...modalState,
    openModal,
    closeModal,
  };
};

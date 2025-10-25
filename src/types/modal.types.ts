import type { Task } from './task.types';

export type ModalMode = 'add' | 'edit';

export interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  taskToEdit: Task | null;
}

export interface TaskModalProps {
  isOpen: boolean;
  mode: ModalMode;
  taskToEdit: Task | null;
  onClose: () => void;
  onSubmit: (text: string) => void | Promise<void>;
}

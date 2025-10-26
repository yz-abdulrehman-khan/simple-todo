export const MODAL_MODE = {
  ADD: 'add',
  EDIT: 'edit',
} as const;

export type ModalModeValue = (typeof MODAL_MODE)[keyof typeof MODAL_MODE];

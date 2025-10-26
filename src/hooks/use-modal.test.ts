import { renderHook, act } from '@testing-library/react';
import { MODAL_MODE } from '@/constants';
import { useModal } from './use-modal';
import type { Task } from '@/types';

describe('useModal', () => {
  const mockTask: Task = {
    id: 1,
    text: 'Test task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  };

  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useModal<Task>());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.mode).toBe(MODAL_MODE.ADD);
    expect(result.current.data).toBeNull();
  });

  it('should open modal in add mode', () => {
    const { result } = renderHook(() => useModal<Task>());
    act(() => {
      result.current.openModal(MODAL_MODE.ADD);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe(MODAL_MODE.ADD);
    expect(result.current.data).toBeNull();
  });

  it('should open modal in edit mode without task', () => {
    const { result } = renderHook(() => useModal<Task>());

    act(() => {
      result.current.openModal(MODAL_MODE.EDIT);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe(MODAL_MODE.EDIT);
    expect(result.current.data).toBeNull();
  });

  it('should open modal in edit mode with task', () => {
    const { result } = renderHook(() => useModal<Task>());

    act(() => {
      result.current.openModal(MODAL_MODE.EDIT, mockTask);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe(MODAL_MODE.EDIT);
    expect(result.current.data).toEqual(mockTask);
  });

  it('should close modal and reset state', () => {
    const { result } = renderHook(() => useModal<Task>());

    // Open modal in edit mode with task
    act(() => {
      result.current.openModal(MODAL_MODE.EDIT, mockTask);
    });

    expect(result.current.isOpen).toBe(true);

    // Close modal
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.mode).toBe(MODAL_MODE.ADD);
    expect(result.current.data).toBeNull();
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useModal<Task>());

    const openModal1 = result.current.openModal;
    const closeModal1 = result.current.closeModal;

    rerender();

    const openModal2 = result.current.openModal;
    const closeModal2 = result.current.closeModal;

    expect(openModal1).toBe(openModal2);
    expect(closeModal1).toBe(closeModal2);
  });

  it('should handle multiple open/close cycles', () => {
    const { result } = renderHook(() => useModal<Task>());

    // First cycle
    act(() => {
      result.current.openModal(MODAL_MODE.ADD);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);

    // Second cycle
    act(() => {
      result.current.openModal(MODAL_MODE.EDIT, mockTask);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(mockTask);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });
});

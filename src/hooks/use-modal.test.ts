import { renderHook, act } from '@testing-library/react';
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
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.mode).toBe('add');
    expect(result.current.taskToEdit).toBeNull();
  });

  it('should open modal in add mode', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.openModal('add');
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe('add');
    expect(result.current.taskToEdit).toBeNull();
  });

  it('should open modal in edit mode without task', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal('edit');
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe('edit');
    expect(result.current.taskToEdit).toBeNull();
  });

  it('should open modal in edit mode with task', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal('edit', mockTask);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe('edit');
    expect(result.current.taskToEdit).toEqual(mockTask);
  });

  it('should close modal and reset state', () => {
    const { result } = renderHook(() => useModal());

    // Open modal in edit mode with task
    act(() => {
      result.current.openModal('edit', mockTask);
    });

    expect(result.current.isOpen).toBe(true);

    // Close modal
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.mode).toBe('add');
    expect(result.current.taskToEdit).toBeNull();
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useModal());

    const openModal1 = result.current.openModal;
    const closeModal1 = result.current.closeModal;

    rerender();

    const openModal2 = result.current.openModal;
    const closeModal2 = result.current.closeModal;

    expect(openModal1).toBe(openModal2);
    expect(closeModal1).toBe(closeModal2);
  });

  it('should handle multiple open/close cycles', () => {
    const { result } = renderHook(() => useModal());

    // First cycle
    act(() => {
      result.current.openModal('add');
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);

    // Second cycle
    act(() => {
      result.current.openModal('edit', mockTask);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.taskToEdit).toEqual(mockTask);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.taskToEdit).toBeNull();
  });
});

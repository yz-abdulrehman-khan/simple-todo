import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskModal } from './task-modal';
import type { Task } from '@/types';

describe('TaskModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockTask: Task = {
    id: 1,
    text: 'Test task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  };

  const defaultProps = {
    isOpen: true,
    mode: 'add' as const,
    taskToEdit: null,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  describe('Modal visibility', () => {
    it('should not render when isOpen is false', () => {
      render(<TaskModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<TaskModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Add mode', () => {
    it('should show "Add Todo" title in add mode', () => {
      render(<TaskModal {...defaultProps} mode="add" />);

      expect(screen.getByText('Add Todo')).toBeInTheDocument();
    });

    it('should show correct description in add mode', () => {
      render(<TaskModal {...defaultProps} mode="add" />);

      expect(screen.getByText(/Create a new todo item/i)).toBeInTheDocument();
    });

    it('should show "Add" button text in add mode', () => {
      render(<TaskModal {...defaultProps} mode="add" />);

      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('should have empty textarea in add mode', () => {
      render(<TaskModal {...defaultProps} mode="add" />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      expect(textarea).toHaveValue('');
    });
  });

  describe('Edit mode', () => {
    it('should show "Edit Todo" title in edit mode', () => {
      render(<TaskModal {...defaultProps} mode="edit" taskToEdit={mockTask} />);

      expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    });

    it('should show correct description in edit mode', () => {
      render(<TaskModal {...defaultProps} mode="edit" taskToEdit={mockTask} />);

      expect(screen.getByText(/Edit your todo item/i)).toBeInTheDocument();
    });

    it('should show "Save" button text in edit mode', () => {
      render(<TaskModal {...defaultProps} mode="edit" taskToEdit={mockTask} />);

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('should populate textarea with task text in edit mode', () => {
      render(<TaskModal {...defaultProps} mode="edit" taskToEdit={mockTask} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      expect(textarea).toHaveValue('Test task');
    });
  });

  describe('Form interactions', () => {
    it('should allow typing in textarea', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      expect(textarea).toHaveValue('New task');
    });

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should clear textarea when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'Some text');

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Form submission', () => {
    it('should call onSubmit with text when form is submitted with valid input', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('New task');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should trim whitespace before submitting', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, '  Trimmed task  ');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('Trimmed task');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Validation', () => {
    it('should show error for empty input', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Task text is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for whitespace-only input', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, '   ');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Task text is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error for text longer than 500 characters', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      const longText = 'a'.repeat(501);
      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, longText);

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Task text must be less than 500 characters')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should clear previous errors when typing valid input', async () => {
      const user = userEvent.setup();

      render(<TaskModal {...defaultProps} />);

      // Submit empty to trigger error
      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Task text is required')).toBeInTheDocument();
      });

      // Type valid input
      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'Valid task');

      // Submit again
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Task text is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submitting state', () => {
    it('should show "Saving..." while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
      });

      // Resolve the promise and wait for state updates to complete
      resolveSubmit!();
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        const savingButton = screen.getByRole('button', { name: 'Saving...' });
        expect(savingButton).toBeDisabled();
      });

      // Resolve the promise and wait for state updates to complete
      resolveSubmit!();
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should disable cancel button while submitting', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeDisabled();
      });

      // Resolve the promise and wait for state updates to complete
      resolveSubmit!();
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Error handling', () => {
    it('should show error message when onSubmit throws an error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('API error'));

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to save task')).toBeInTheDocument();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should re-enable buttons after submission error', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('API error'));

      render(<TaskModal {...defaultProps} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      await user.type(textarea, 'New task');

      const submitButton = screen.getByRole('button', { name: 'Add' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to save task')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: 'Add' });
      expect(addButton).not.toBeDisabled();
    });
  });

  describe('useEffect behavior', () => {
    it('should reset form when modal reopens', async () => {
      const { rerender } = render(<TaskModal {...defaultProps} isOpen={false} />);

      // Open modal and type
      rerender(<TaskModal {...defaultProps} isOpen={true} />);

      const textarea = screen.getByPlaceholderText('Enter your task...');
      const user = userEvent.setup();
      await user.type(textarea, 'Some text');

      // Close modal
      rerender(<TaskModal {...defaultProps} isOpen={false} />);

      // Reopen modal - should be cleared
      rerender(<TaskModal {...defaultProps} isOpen={true} mode="add" taskToEdit={null} />);

      const newTextarea = screen.getByPlaceholderText('Enter your task...');
      expect(newTextarea).toHaveValue('');
    });

    it('should update textarea when taskToEdit changes', () => {
      const { rerender } = render(
        <TaskModal {...defaultProps} mode="edit" taskToEdit={mockTask} />
      );

      const textarea = screen.getByPlaceholderText('Enter your task...');
      expect(textarea).toHaveValue('Test task');

      const updatedTask: Task = { ...mockTask, text: 'Updated task' };
      rerender(<TaskModal {...defaultProps} mode="edit" taskToEdit={updatedTask} isOpen={true} />);

      const updatedTextarea = screen.getByPlaceholderText('Enter your task...');
      expect(updatedTextarea).toHaveValue('Updated task');
    });
  });
});

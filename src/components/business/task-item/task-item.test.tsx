import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from './task-item';
import type { Task } from '@/types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        edit: 'Edit task',
        delete: 'Delete task',
      };
      return translations[key] || key;
    },
  }),
}));

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    text: 'Test task',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task text', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('should render unchecked checkbox for active task', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox for completed task', () => {
    const completedTask: Task = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1, true);
  });

  it('should disable checkbox for deleted task', () => {
    const deletedTask: Task = { ...mockTask, deleted: true };

    render(
      <TaskItem
        task={deletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should show edit button for active task', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByLabelText('Edit task');
    expect(editButton).toBeInTheDocument();
  });

  it('should not show edit button for completed task', () => {
    const completedTask: Task = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.queryByLabelText('Edit task');
    expect(editButton).not.toBeInTheDocument();
  });

  it('should not show edit button for deleted task', () => {
    const deletedTask: Task = { ...mockTask, deleted: true };

    render(
      <TaskItem
        task={deletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.queryByLabelText('Edit task');
    expect(editButton).not.toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByLabelText('Edit task');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onEdit when task text is double-clicked for active task', async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('Test task');
    await user.dblClick(taskText);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should not call onEdit when double-clicking completed task', async () => {
    const user = userEvent.setup();
    const completedTask: Task = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('Test task');
    await user.dblClick(taskText);

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('should not call onEdit when double-clicking deleted task', async () => {
    const user = userEvent.setup();
    const deletedTask: Task = { ...mockTask, deleted: true };

    render(
      <TaskItem
        task={deletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('Test task');
    await user.dblClick(taskText);

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('should always show delete button', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TaskItem
        task={mockTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should apply line-through style for completed task', () => {
    const completedTask: Task = { ...mockTask, completed: true };

    render(
      <TaskItem
        task={completedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('Test task');
    expect(taskText).toHaveClass('line-through');
  });

  it('should apply gray text style for deleted task', () => {
    const deletedTask: Task = { ...mockTask, deleted: true };

    render(
      <TaskItem
        task={deletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('Test task');
    expect(taskText).toHaveClass('text-gray-400');
  });
});

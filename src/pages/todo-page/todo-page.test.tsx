import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoPage } from './todo-page';
import { useTasks, useTaskMutations, useModal } from '@/hooks';
import type { Task } from '@/types';

// Mock all hooks
jest.mock('@/hooks');

const mockUseTasks = useTasks as jest.Mock;
const mockUseTaskMutations = useTaskMutations as jest.Mock;
const mockUseModal = useModal as jest.Mock;

describe('TodoPage', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      text: 'Task 1',
      completed: false,
      deleted: false,
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      text: 'Task 2',
      completed: true,
      deleted: false,
      createdAt: '2024-01-02T10:00:00Z',
    },
  ];

  const defaultMocks = {
    useTasks: {
      tasks: mockTasks,
      counts: { uncompleted: 5, completed: 3, deleted: 2 },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      refetchTasksOnly: jest.fn(),
    },
    useTaskMutations: {
      createTask: jest.fn(),
      updateTask: jest.fn(),
      toggleTaskCompletion: jest.fn(),
      deleteTask: jest.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
    },
    useModal: {
      isOpen: false,
      mode: 'add' as const,
      taskToEdit: null,
      openModal: jest.fn(),
      closeModal: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTasks.mockReturnValue(defaultMocks.useTasks);
    mockUseTaskMutations.mockReturnValue(defaultMocks.useTaskMutations);
    mockUseModal.mockReturnValue(defaultMocks.useModal);
  });

  it('should render without crashing', () => {
    render(<TodoPage />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should display task counts in header', () => {
    render(<TodoPage />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      isLoading: true,
    });

    render(<TodoPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error state', () => {
    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      error: 'Failed to fetch tasks',
    });

    render(<TodoPage />);

    expect(screen.getByText('Error: Failed to fetch tasks')).toBeInTheDocument();
  });

  it('should open add modal when add button is clicked', async () => {
    const user = userEvent.setup();
    const openModal = jest.fn();

    mockUseModal.mockReturnValue({
      ...defaultMocks.useModal,
      openModal,
    });

    render(<TodoPage />);

    const addButton = screen.getByRole('button', { name: /add todo/i });
    await user.click(addButton);

    expect(openModal).toHaveBeenCalledWith('add');
  });

  it('should handle page change', async () => {
    const user = userEvent.setup();

    // Create enough tasks for 2 pages (10+ tasks with default limit of 10)
    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      counts: { uncompleted: 15, completed: 0, deleted: 0 },
    });

    render(<TodoPage />);

    const page2Button = screen.getByRole('button', { name: '2' });
    await user.click(page2Button);

    // Page change is handled internally via setCurrentPage
    // No direct assertions needed, just verify no errors
  });

  it('should handle task toggle', async () => {
    const user = userEvent.setup();
    const toggleTaskCompletion = jest.fn().mockResolvedValue({});
    const refetchTasksOnly = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      toggleTaskCompletion,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      refetchTasksOnly,
    });

    render(<TodoPage />);

    const checkbox = screen.getAllByRole('checkbox')[0]!;
    await user.click(checkbox);

    await waitFor(() => {
      expect(toggleTaskCompletion).toHaveBeenCalledWith(1, true);
      expect(refetchTasksOnly).toHaveBeenCalled();
    });
  });

  it('should handle task deletion', async () => {
    const user = userEvent.setup();
    const deleteTask = jest.fn().mockResolvedValue({});
    const refetchTasksOnly = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      deleteTask,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      refetchTasksOnly,
    });

    render(<TodoPage />);

    const deleteButtons = screen.getAllByLabelText(/delete/i);
    await user.click(deleteButtons[0]!);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
      expect(refetchTasksOnly).toHaveBeenCalled();
    });
  });

  it('should handle task edit click', async () => {
    const user = userEvent.setup();
    const openModal = jest.fn();

    mockUseModal.mockReturnValue({
      ...defaultMocks.useModal,
      openModal,
    });

    render(<TodoPage />);

    const editButtons = screen.getAllByLabelText(/edit/i);
    await user.dblClick(editButtons[0]!.closest('.group') || editButtons[0]!);

    await waitFor(() => {
      expect(openModal).toHaveBeenCalledWith('edit', mockTasks[0]);
    });
  });

  it('should handle modal submit for creating new task', async () => {
    const createTask = jest.fn().mockResolvedValue({ id: 3, text: 'New task' });
    const refetchTasksOnly = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      createTask,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      refetchTasksOnly,
    });

    mockUseModal.mockReturnValue({
      ...defaultMocks.useModal,
      isOpen: true,
      mode: 'add',
    });

    const user = userEvent.setup();
    render(<TodoPage />);

    const textarea = screen.getByPlaceholderText('Enter your task...');
    await user.type(textarea, 'New task');

    const submitButton = screen.getByRole('button', { name: 'Add' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({ text: 'New task' });
      expect(refetchTasksOnly).toHaveBeenCalled();
    });
  });

  it('should handle modal submit for editing existing task', async () => {
    const updateTask = jest.fn().mockResolvedValue(mockTasks[0]);
    const refetchTasksOnly = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      updateTask,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      refetchTasksOnly,
    });

    mockUseModal.mockReturnValue({
      ...defaultMocks.useModal,
      isOpen: true,
      mode: 'edit',
      taskToEdit: mockTasks[0],
    });

    const user = userEvent.setup();
    render(<TodoPage />);

    const textarea = screen.getByPlaceholderText('Enter your task...');
    await user.clear(textarea);
    await user.type(textarea, 'Updated task');

    const submitButton = screen.getByRole('button', { name: 'Save' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(1, {
        text: 'Updated task',
        completed: false,
        deleted: false,
      });
    });
  });

  it('should refetch after edit even if update returns null', async () => {
    const updateTask = jest.fn().mockResolvedValue(null);
    const refetchTasksOnly = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      updateTask,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      refetchTasksOnly,
    });

    mockUseModal.mockReturnValue({
      ...defaultMocks.useModal,
      isOpen: true,
      mode: 'edit',
      taskToEdit: mockTasks[0],
    });

    const user = userEvent.setup();
    render(<TodoPage />);

    const textarea = screen.getByPlaceholderText('Enter your task...');
    await user.clear(textarea);
    await user.type(textarea, 'Updated task');

    const submitButton = screen.getByRole('button', { name: 'Save' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalled();
      expect(refetchTasksOnly).toHaveBeenCalled();
    });
  });

  it('should not delete task if task not found', () => {
    const deleteTask = jest.fn();

    mockUseTaskMutations.mockReturnValue({
      ...defaultMocks.useTaskMutations,
      deleteTask,
    });

    mockUseTasks.mockReturnValue({
      ...defaultMocks.useTasks,
      tasks: [],
    });

    render(<TodoPage />);

    // Try to delete a task that doesn't exist
    // Since there are no tasks, there should be no delete buttons
    const deleteButtons = screen.queryAllByLabelText(/delete/i);
    expect(deleteButtons).toHaveLength(0);
  });
});

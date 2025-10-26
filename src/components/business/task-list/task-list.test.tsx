import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './task-list';
import type { Task } from '@/types';

describe('TaskList', () => {
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
    {
      id: 3,
      text: 'Task 3',
      completed: false,
      deleted: true,
      createdAt: '2024-01-03T10:00:00Z',
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    onToggleTask: jest.fn(),
    onDeleteTask: jest.fn(),
    onEditTask: jest.fn(),
    onPageChange: jest.fn(),
    canGoPrevious: false,
    canGoNext: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading message when isLoading is true', () => {
      render(<TaskList {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
    });

    it('should not show tasks when loading', () => {
      render(<TaskList {...defaultProps} isLoading={true} />);

      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should show empty message when no tasks', () => {
      render(<TaskList {...defaultProps} tasks={[]} />);

      expect(screen.getByText('No tasks found. Create one to get started!')).toBeInTheDocument();
    });

    it('should not show pagination when no tasks', () => {
      render(<TaskList {...defaultProps} tasks={[]} totalPages={5} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Task rendering', () => {
    it('should render all tasks', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('should render correct number of checkboxes', () => {
      render(<TaskList {...defaultProps} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should pass correct props to TaskItem', async () => {
      const user = userEvent.setup();
      const onToggleTask = jest.fn();

      render(<TaskList {...defaultProps} onToggleTask={onToggleTask} />);

      const firstCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(firstCheckbox!);

      expect(onToggleTask).toHaveBeenCalledWith(1, true);
    });
  });

  describe('Pagination - single page', () => {
    it('should not show pagination controls when totalPages is 1', () => {
      const { container } = render(<TaskList {...defaultProps} totalPages={1} />);

      // Check that pagination container doesn't exist
      const paginationContainer = container.querySelector('.mt-6');
      expect(paginationContainer).not.toBeInTheDocument();
    });
  });

  describe('Pagination - multiple pages', () => {
    it('should show pagination controls when totalPages > 1', () => {
      render(<TaskList {...defaultProps} totalPages={5} currentPage={1} canGoNext={true} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render page numbers', () => {
      render(<TaskList {...defaultProps} totalPages={3} currentPage={1} canGoNext={true} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render ellipsis for large page counts', () => {
      render(<TaskList {...defaultProps} totalPages={10} currentPage={5} />);

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should disable previous button when canGoPrevious is false', () => {
      const { container } = render(
        <TaskList {...defaultProps} totalPages={3} currentPage={1} canGoPrevious={false} />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const prevButton = paginationContainer?.querySelector('button');
      expect(prevButton).toBeDisabled();
    });

    it('should enable previous button when canGoPrevious is true', () => {
      const { container } = render(
        <TaskList
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          canGoPrevious={true}
          canGoNext={true}
        />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const prevButton = paginationContainer?.querySelector('button');
      expect(prevButton).not.toBeDisabled();
    });

    it('should disable next button when canGoNext is false', () => {
      const { container } = render(
        <TaskList {...defaultProps} totalPages={3} currentPage={3} canGoNext={false} />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const buttons = paginationContainer?.querySelectorAll('button');
      const nextButton = buttons?.[buttons.length - 1];
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when canGoNext is true', () => {
      const { container } = render(
        <TaskList {...defaultProps} totalPages={3} currentPage={1} canGoNext={true} />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const buttons = paginationContainer?.querySelectorAll('button');
      const nextButton = buttons?.[buttons.length - 1];
      expect(nextButton).not.toBeDisabled();
    });

    it('should call onPageChange with previous page when clicking previous button', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      const { container } = render(
        <TaskList
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          canGoPrevious={true}
          onPageChange={onPageChange}
        />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const prevButton = paginationContainer?.querySelector('button');
      await user.click(prevButton!);

      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageChange with next page when clicking next button', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      const { container } = render(
        <TaskList
          {...defaultProps}
          totalPages={3}
          currentPage={1}
          canGoNext={true}
          onPageChange={onPageChange}
        />
      );

      const paginationContainer = container.querySelector('.mt-6');
      const buttons = paginationContainer?.querySelectorAll('button');
      const nextButton = buttons?.[buttons.length - 1];
      await user.click(nextButton!);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with clicked page number', async () => {
      const user = userEvent.setup();
      const onPageChange = jest.fn();

      render(
        <TaskList
          {...defaultProps}
          totalPages={3}
          currentPage={1}
          canGoNext={true}
          onPageChange={onPageChange}
        />
      );

      const page2Button = screen.getByRole('button', { name: '2' });
      await user.click(page2Button);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should highlight current page', () => {
      render(<TaskList {...defaultProps} totalPages={3} currentPage={2} canGoNext={true} />);

      const page2Button = screen.getByRole('button', { name: '2' });
      expect(page2Button).toHaveClass('border-purple-600');
    });
  });

  describe('Task interactions', () => {
    it('should call onDeleteTask when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDeleteTask = jest.fn();

      render(<TaskList {...defaultProps} onDeleteTask={onDeleteTask} />);

      const deleteButtons = screen.getAllByLabelText('Delete task');
      await user.click(deleteButtons[0]!);

      expect(onDeleteTask).toHaveBeenCalledWith(1);
    });

    it('should call onEditTask when edit button is clicked', async () => {
      const user = userEvent.setup();
      const onEditTask = jest.fn();

      render(<TaskList {...defaultProps} onEditTask={onEditTask} />);

      const editButtons = screen.getAllByLabelText('Edit task');
      await user.click(editButtons[0]!);

      expect(onEditTask).toHaveBeenCalledWith(mockTasks[0]);
    });
  });
});

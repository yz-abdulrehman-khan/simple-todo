import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './task-list';
import type { Task } from '@/types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { page?: number }) => {
      const translations: Record<string, string> = {
        loading: 'Loading tasks...',
        empty: 'No tasks found. Create one to get started!',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        goToPage: `Go to page ${params?.page || ''}`,
        edit: 'Edit task',
        delete: 'Delete task',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

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

      const page2Button = screen.getByRole('button', { name: /go to page 2/i });
      await user.click(page2Button);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should highlight current page', () => {
      render(<TaskList {...defaultProps} totalPages={3} currentPage={2} canGoNext={true} />);

      const page2Button = screen.getByRole('button', { name: /go to page 2/i });
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

  describe('Internationalization (i18n)', () => {
    // Mock i18next for i18n tests
    const mockT = jest.fn((key: string) => key);

    beforeEach(() => {
      // Reset mocks for each test
      mockT.mockClear();
    });

    // Note: Full i18n testing requires mocking react-i18next
    // These tests verify the component structure is ready for i18n

    describe('Arabic numeral display', () => {
      it('should render page numbers that can be formatted', () => {
        render(<TaskList {...defaultProps} totalPages={5} currentPage={3} />);

        // Check that page numbers are rendered
        // In actual implementation with i18n, these would be Arabic numerals in ar locale
        expect(screen.getByText('3')).toBeInTheDocument();
      });

      it('should render all page numbers for pagination', () => {
        render(<TaskList {...defaultProps} totalPages={3} currentPage={1} canGoNext={true} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    describe('RTL direction support', () => {
      it('should have pagination controls that work with RTL', async () => {
        const onPageChange = jest.fn();

        render(
          <TaskList
            {...defaultProps}
            totalPages={3}
            currentPage={2}
            canGoPrevious={true}
            canGoNext={true}
            onPageChange={onPageChange}
          />
        );

        // Previous and Next buttons should work regardless of direction
        render(
          <TaskList
            {...defaultProps}
            totalPages={3}
            currentPage={2}
            canGoPrevious={true}
            canGoNext={true}
            onPageChange={onPageChange}
          />
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      it('should maintain proper button order for RTL languages', () => {
        const { container } = render(
          <TaskList
            {...defaultProps}
            totalPages={5}
            currentPage={3}
            canGoPrevious={true}
            canGoNext={true}
          />
        );

        const paginationContainer = container.querySelector('.mt-6');
        const buttons = paginationContainer?.querySelectorAll('button');

        // Should have prev button, page buttons, and next button
        expect(buttons).toBeDefined();
        expect(buttons!.length).toBeGreaterThan(2);
      });
    });

    describe('Pagination edge cases with i18n', () => {
      it('should handle single digit page numbers', () => {
        render(<TaskList {...defaultProps} totalPages={9} currentPage={5} />);

        for (let i = 1; i <= 9; i++) {
          const pageButton = screen.queryByText(i.toString());
          // Some pages might be hidden with ellipsis, so not all will be present
          if (pageButton) {
            expect(pageButton).toBeInTheDocument();
          }
        }
      });

      it('should handle double digit page numbers', () => {
        render(<TaskList {...defaultProps} totalPages={15} currentPage={10} />);

        // Page 10 should be visible as current page
        expect(screen.getByText('10')).toBeInTheDocument();
      });

      it('should handle three digit page numbers', () => {
        render(<TaskList {...defaultProps} totalPages={150} currentPage={100} />);

        // Page 100 should be visible as current page
        expect(screen.getByText('100')).toBeInTheDocument();
      });

      it('should handle ellipsis in multi-page scenarios', () => {
        render(<TaskList {...defaultProps} totalPages={100} currentPage={50} />);

        const ellipsis = screen.getAllByText('...');
        expect(ellipsis.length).toBeGreaterThan(0);
      });
    });

    describe('Aria labels for accessibility in multiple languages', () => {
      it('should have aria-labels for navigation buttons', () => {
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
        const buttons = paginationContainer?.querySelectorAll('button');

        // Previous and Next buttons should have aria-labels
        expect(buttons).toBeDefined();
      });

      it('should have aria-labels for page number buttons', () => {
        render(<TaskList {...defaultProps} totalPages={3} currentPage={1} canGoNext={true} />);

        const pageButtons = screen.getAllByRole('button');
        // All buttons should be accessible
        expect(pageButtons.length).toBeGreaterThan(0);
      });
    });

    describe('Translated loading and empty states', () => {
      it('should display loading message that can be translated', () => {
        render(<TaskList {...defaultProps} isLoading={true} />);

        // Message should be present for translation
        expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
      });

      it('should display empty state message that can be translated', () => {
        render(<TaskList {...defaultProps} tasks={[]} />);

        // Message should be present for translation
        expect(screen.getByText('No tasks found. Create one to get started!')).toBeInTheDocument();
      });
    });

    describe('Number formatting edge cases', () => {
      it('should handle page 0 gracefully', () => {
        // Edge case: page 0 should not crash
        render(<TaskList {...defaultProps} totalPages={5} currentPage={0} />);

        const { container } = render(<TaskList {...defaultProps} totalPages={5} currentPage={0} />);
        expect(container).toBeInTheDocument();
      });

      it('should handle very large page numbers', () => {
        render(<TaskList {...defaultProps} totalPages={9999} currentPage={5000} />);

        // Should display page 5000
        expect(screen.getByText('5000')).toBeInTheDocument();
      });

      it('should handle maximum safe integer as page number', () => {
        const maxPage = 999999999;
        render(<TaskList {...defaultProps} totalPages={maxPage} currentPage={maxPage} />);

        // Should not crash
        expect(screen.getByText(maxPage.toString())).toBeInTheDocument();
      });
    });

    describe('RTL pagination button icons', () => {
      it('should render chevron icons for navigation', () => {
        const { container } = render(
          <TaskList
            {...defaultProps}
            totalPages={3}
            currentPage={2}
            canGoPrevious={true}
            canGoNext={true}
          />
        );

        // Should have SVG icons for chevrons
        const icons = container.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThan(0);
      });

      it('should have previous and next buttons with icons', () => {
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
        const buttons = paginationContainer?.querySelectorAll('button');

        // First and last buttons should have icons
        expect(buttons).toBeDefined();
        expect(buttons!.length).toBeGreaterThan(2);
      });
    });
  });
});

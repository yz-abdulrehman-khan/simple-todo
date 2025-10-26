import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskHeader } from './task-header';
import type { TaskCounts } from '@/types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        title: 'The Todo',
        addTodo: 'Add Todo',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('TaskHeader', () => {
  const mockCounts: TaskCounts = {
    uncompleted: 5,
    completed: 3,
    deleted: 2,
  };

  const mockOnAddClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title "The Todo"', () => {
    render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    expect(screen.getByText('The Todo')).toBeInTheDocument();
  });

  it('should render the header as a header element', () => {
    const { container } = render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render TaskStats with correct counts', () => {
    render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render "Add Todo" button', () => {
    render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('should call onAddClick when "Add Todo" button is clicked', async () => {
    const user = userEvent.setup();

    render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    const addButton = screen.getByRole('button', { name: /add todo/i });
    await user.click(addButton);

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onAddClick on initial render', () => {
    render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    expect(mockOnAddClick).not.toHaveBeenCalled();
  });

  it('should render with zero counts', () => {
    const zeroCounts: TaskCounts = {
      uncompleted: 0,
      completed: 0,
      deleted: 0,
    };

    render(<TaskHeader counts={zeroCounts} onAddClick={mockOnAddClick} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('should have proper header styling classes', () => {
    const { container } = render(<TaskHeader counts={mockCounts} onAddClick={mockOnAddClick} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('w-full', 'bg-white', 'border-b');
  });
});

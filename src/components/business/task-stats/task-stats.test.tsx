import { render, screen } from '@testing-library/react';
import { TaskStats } from './task-stats';
import type { TaskCounts } from '@/types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        uncompleted: 'Uncompleted',
        completed: 'Completed',
        deleted: 'Deleted',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

describe('TaskStats', () => {
  const mockCounts: TaskCounts = {
    uncompleted: 5,
    completed: 3,
    deleted: 2,
  };

  it('should render all three count badges', () => {
    render(<TaskStats counts={mockCounts} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display uncompleted count', () => {
    render(<TaskStats counts={mockCounts} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display completed count', () => {
    render(<TaskStats counts={mockCounts} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display deleted count', () => {
    render(<TaskStats counts={mockCounts} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render with zero counts', () => {
    const zeroCounts: TaskCounts = {
      uncompleted: 0,
      completed: 0,
      deleted: 0,
    };

    render(<TaskStats counts={zeroCounts} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('should render with large numbers', () => {
    const largeCounts: TaskCounts = {
      uncompleted: 999,
      completed: 1234,
      deleted: 42,
    };

    render(<TaskStats counts={largeCounts} />);

    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<TaskStats counts={mockCounts} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2');
  });

  describe('Internationalization (i18n) - Arabic Numerals', () => {
    it('should render numbers for formatting', () => {
      render(<TaskStats counts={mockCounts} />);

      // Numbers should be present for i18n formatting
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should handle single-digit counts', () => {
      const singleDigit: TaskCounts = {
        uncompleted: 1,
        completed: 2,
        deleted: 3,
      };

      render(<TaskStats counts={singleDigit} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should handle double-digit counts', () => {
      const doubleDigit: TaskCounts = {
        uncompleted: 10,
        completed: 25,
        deleted: 99,
      };

      render(<TaskStats counts={doubleDigit} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('should handle triple-digit counts', () => {
      const tripleDigit: TaskCounts = {
        uncompleted: 100,
        completed: 500,
        deleted: 999,
      };

      render(<TaskStats counts={tripleDigit} />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('should handle very large numbers', () => {
      const largeCounts: TaskCounts = {
        uncompleted: 10000,
        completed: 50000,
        deleted: 99999,
      };

      render(<TaskStats counts={largeCounts} />);

      expect(screen.getByText('10000')).toBeInTheDocument();
      expect(screen.getByText('50000')).toBeInTheDocument();
      expect(screen.getByText('99999')).toBeInTheDocument();
    });

    it('should handle numbers with repeating digits', () => {
      const repeatingDigits: TaskCounts = {
        uncompleted: 111,
        completed: 222,
        deleted: 333,
      };

      render(<TaskStats counts={repeatingDigits} />);

      expect(screen.getByText('111')).toBeInTheDocument();
      expect(screen.getByText('222')).toBeInTheDocument();
      expect(screen.getByText('333')).toBeInTheDocument();
    });

    it('should handle all different single digits (0-9)', () => {
      for (let i = 0; i <= 9; i++) {
        const counts: TaskCounts = {
          uncompleted: i,
          completed: i + 10, // Make them unique
          deleted: i + 20, // Make them unique
        };

        const { unmount } = render(<TaskStats counts={counts} />);
        expect(screen.getByText(i.toString())).toBeInTheDocument();
        unmount();
      }
    });

    it('should handle edge case of maximum count', () => {
      const maxCounts: TaskCounts = {
        uncompleted: 999999,
        completed: 999999,
        deleted: 999999,
      };

      render(<TaskStats counts={maxCounts} />);

      const maxElements = screen.getAllByText('999999');
      expect(maxElements).toHaveLength(3);
    });
  });

  describe('Badge tooltips for accessibility', () => {
    it('should have title attributes for tooltips', () => {
      const { container } = render(<TaskStats counts={mockCounts} />);

      const badges = container.querySelectorAll('[title]');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should have different background colors for each badge', () => {
      const { container } = render(<TaskStats counts={mockCounts} />);

      const uncompletedBadge = container.querySelector('.bg-purple-600');
      const deletedBadge = container.querySelector('.bg-red-500');
      const completedBadge = container.querySelector('.bg-green-500');

      expect(uncompletedBadge).toBeInTheDocument();
      expect(deletedBadge).toBeInTheDocument();
      expect(completedBadge).toBeInTheDocument();
    });
  });
});

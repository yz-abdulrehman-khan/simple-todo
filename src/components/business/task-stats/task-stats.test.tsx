import { render, screen } from '@testing-library/react';
import { TaskStats } from './task-stats';
import type { TaskCounts } from '@/types';

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
});

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskStats } from './task-stats';

const meta = {
  title: 'Business/TaskStats',
  component: TaskStats,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    counts: {
      description: 'Task counts object containing uncompleted, deleted, and completed counts',
    },
  },
} satisfies Meta<typeof TaskStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    counts: {
      uncompleted: 5,
      deleted: 2,
      completed: 3,
    },
  },
};

export const AllZero: Story = {
  args: {
    counts: {
      uncompleted: 0,
      deleted: 0,
      completed: 0,
    },
  },
};

export const HighCounts: Story = {
  args: {
    counts: {
      uncompleted: 42,
      deleted: 15,
      completed: 128,
    },
  },
};

export const OnlyUncompleted: Story = {
  args: {
    counts: {
      uncompleted: 10,
      deleted: 0,
      completed: 0,
    },
  },
};

export const OnlyCompleted: Story = {
  args: {
    counts: {
      uncompleted: 0,
      deleted: 0,
      completed: 25,
    },
  },
};

export const WithDeleted: Story = {
  args: {
    counts: {
      uncompleted: 3,
      deleted: 8,
      completed: 12,
    },
  },
};

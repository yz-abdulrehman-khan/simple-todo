import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskList } from './task-list';

const meta = {
  title: 'Business/TaskList',
  component: TaskList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    tasks: {
      description: 'Array of tasks to display',
    },
    isLoading: {
      description: 'Loading state indicator',
    },
    currentPage: {
      description: 'Current active page number',
    },
    totalPages: {
      description: 'Total number of pages available',
    },
    onToggleTask: {
      description: 'Callback when task completion is toggled',
    },
    onDeleteTask: {
      description: 'Callback when task is deleted',
    },
    onEditTask: {
      description: 'Callback when task is edited',
    },
    onPageChange: {
      description: 'Callback when page is changed',
    },
    canGoPrevious: {
      description: 'Whether previous page navigation is available',
    },
    canGoNext: {
      description: 'Whether next page navigation is available',
    },
  },
  args: {
    onToggleTask: () => console.log('Toggle task'),
    onDeleteTask: () => console.log('Delete task'),
    onEditTask: () => console.log('Edit task'),
    onPageChange: () => console.log('Page change'),
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTasks = [
  {
    id: 1,
    text: 'Complete project documentation',
    completed: false,
    deleted: false,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    text: 'Review pull requests',
    completed: true,
    deleted: false,
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 3,
    text: 'Write unit tests',
    completed: false,
    deleted: false,
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: 4,
    text: 'Update dependencies',
    completed: false,
    deleted: false,
    createdAt: '2024-01-04T10:00:00Z',
  },
  {
    id: 5,
    text: 'Fix responsive layout issues',
    completed: true,
    deleted: false,
    createdAt: '2024-01-05T10:00:00Z',
  },
];

export const Default: Story = {
  args: {
    tasks: mockTasks,
    isLoading: false,
    currentPage: 1,
    totalPages: 3,
    canGoPrevious: false,
    canGoNext: true,
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    isLoading: true,
    currentPage: 1,
    totalPages: 1,
    canGoPrevious: false,
    canGoNext: false,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    canGoPrevious: false,
    canGoNext: false,
  },
};

export const SinglePage: Story = {
  args: {
    tasks: mockTasks.slice(0, 3),
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    canGoPrevious: false,
    canGoNext: false,
  },
};

export const MiddlePage: Story = {
  args: {
    tasks: mockTasks,
    isLoading: false,
    currentPage: 5,
    totalPages: 10,
    canGoPrevious: true,
    canGoNext: true,
  },
};

export const LastPage: Story = {
  args: {
    tasks: mockTasks.slice(0, 2),
    isLoading: false,
    currentPage: 10,
    totalPages: 10,
    canGoPrevious: true,
    canGoNext: false,
  },
};

export const ManyPages: Story = {
  args: {
    tasks: mockTasks,
    isLoading: false,
    currentPage: 15,
    totalPages: 50,
    canGoPrevious: true,
    canGoNext: true,
  },
};

export const OnlyCompletedTasks: Story = {
  args: {
    tasks: [
      {
        id: 1,
        text: 'Completed task 1',
        completed: true,
        deleted: false,
        createdAt: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        text: 'Completed task 2',
        completed: true,
        deleted: false,
        createdAt: '2024-01-02T10:00:00Z',
      },
      {
        id: 3,
        text: 'Completed task 3',
        completed: true,
        deleted: false,
        createdAt: '2024-01-03T10:00:00Z',
      },
    ],
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
    canGoPrevious: false,
    canGoNext: false,
  },
};

export const MixedStates: Story = {
  args: {
    tasks: [
      {
        id: 1,
        text: 'Active task',
        completed: false,
        deleted: false,
        createdAt: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        text: 'Completed task',
        completed: true,
        deleted: false,
        createdAt: '2024-01-02T10:00:00Z',
      },
      {
        id: 3,
        text: 'Deleted task',
        completed: false,
        deleted: true,
        createdAt: '2024-01-03T10:00:00Z',
      },
      {
        id: 4,
        text: 'Completed and deleted',
        completed: true,
        deleted: true,
        createdAt: '2024-01-04T10:00:00Z',
      },
    ],
    isLoading: false,
    currentPage: 1,
    totalPages: 2,
    canGoPrevious: false,
    canGoNext: true,
  },
};

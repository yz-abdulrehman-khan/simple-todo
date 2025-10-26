import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskItem } from './task-item';

const meta = {
  title: 'Business/TaskItem',
  component: TaskItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    task: {
      description: 'Task object to display',
    },
    onToggle: {
      description: 'Callback when task completion is toggled',
    },
    onDelete: {
      description: 'Callback when task is deleted',
    },
    onEdit: {
      description: 'Callback when task is edited',
    },
  },
  args: {
    onToggle: () => console.log('Toggle clicked'),
    onDelete: () => console.log('Delete clicked'),
    onEdit: () => console.log('Edit clicked'),
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TaskItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncompleted: Story = {
  args: {
    task: {
      id: 1,
      text: 'Complete the project documentation',
      completed: false,
      deleted: false,
      createdAt: '2024-01-01T10:00:00Z',
    },
  },
};

export const Completed: Story = {
  args: {
    task: {
      id: 2,
      text: 'Write unit tests for all components',
      completed: true,
      deleted: false,
      createdAt: '2024-01-02T10:00:00Z',
    },
  },
};

export const Deleted: Story = {
  args: {
    task: {
      id: 3,
      text: 'Old task that was removed',
      completed: false,
      deleted: true,
      createdAt: '2024-01-03T10:00:00Z',
    },
  },
};

export const CompletedAndDeleted: Story = {
  args: {
    task: {
      id: 4,
      text: 'Completed task that was also deleted',
      completed: true,
      deleted: true,
      createdAt: '2024-01-04T10:00:00Z',
    },
  },
};

export const LongText: Story = {
  args: {
    task: {
      id: 5,
      text: 'This is a very long task description that demonstrates how the component handles lengthy text content. It should wrap properly and maintain good readability even with multiple lines of text.',
      completed: false,
      deleted: false,
      createdAt: '2024-01-05T10:00:00Z',
    },
  },
};

export const ShortText: Story = {
  args: {
    task: {
      id: 6,
      text: 'Buy milk',
      completed: false,
      deleted: false,
      createdAt: '2024-01-06T10:00:00Z',
    },
  },
};

export const WithSpecialCharacters: Story = {
  args: {
    task: {
      id: 7,
      text: 'Fix bug in API endpoint: /api/v1/tasks/{id} - returns 404 instead of 400',
      completed: false,
      deleted: false,
      createdAt: '2024-01-07T10:00:00Z',
    },
  },
};

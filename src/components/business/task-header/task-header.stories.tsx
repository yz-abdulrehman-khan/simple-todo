import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskHeader } from './task-header';

const meta = {
  title: 'Business/TaskHeader',
  component: TaskHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    counts: {
      description: 'Task counts object containing uncompleted, deleted, and completed counts',
    },
    onAddClick: {
      description: 'Callback function triggered when the Add Todo button is clicked',
    },
  },
  args: {
    onAddClick: () => console.log('Add button clicked'),
  },
} satisfies Meta<typeof TaskHeader>;

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

export const Empty: Story = {
  args: {
    counts: {
      uncompleted: 0,
      deleted: 0,
      completed: 0,
    },
  },
};

export const HighActivity: Story = {
  args: {
    counts: {
      uncompleted: 42,
      deleted: 15,
      completed: 128,
    },
  },
};

export const NewUser: Story = {
  args: {
    counts: {
      uncompleted: 1,
      deleted: 0,
      completed: 0,
    },
  },
};

export const ProductiveUser: Story = {
  args: {
    counts: {
      uncompleted: 3,
      deleted: 1,
      completed: 97,
    },
  },
};

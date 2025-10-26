import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskModal } from './task-modal';

const meta = {
  title: 'Business/TaskModal',
  component: TaskModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: 'Whether the modal is open',
    },
    mode: {
      description: 'Modal mode - add or edit',
      control: 'radio',
      options: ['add', 'edit'],
    },
    taskToEdit: {
      description: 'Task to edit (only for edit mode)',
    },
    onClose: {
      description: 'Callback when modal is closed',
    },
    onSubmit: {
      description: 'Callback when form is submitted with task text',
    },
  },
  args: {
    onClose: () => console.log('Modal closed'),
    onSubmit: async () => {
      console.log('Task submitted');
      return Promise.resolve();
    },
  },
} satisfies Meta<typeof TaskModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddMode: Story = {
  args: {
    isOpen: true,
    mode: 'add',
    taskToEdit: null,
  },
};

export const EditMode: Story = {
  args: {
    isOpen: true,
    mode: 'edit',
    taskToEdit: {
      id: 1,
      text: 'Complete project documentation',
      completed: false,
      deleted: false,
      createdAt: '2024-01-01T10:00:00Z',
    },
  },
};

export const EditModeWithLongText: Story = {
  args: {
    isOpen: true,
    mode: 'edit',
    taskToEdit: {
      id: 2,
      text: 'This is a very long task description that needs to be edited. It contains multiple sentences and demonstrates how the modal handles lengthy content that requires scrolling within the textarea component.',
      completed: false,
      deleted: false,
      createdAt: '2024-01-02T10:00:00Z',
    },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    mode: 'add',
    taskToEdit: null,
  },
};

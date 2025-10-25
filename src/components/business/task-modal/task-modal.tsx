import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Textarea,
} from '@/components/ui';
import type { TaskModalProps } from '@/types';
import { createTaskSchema } from '@/validations';

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  mode,
  taskToEdit,
  onClose,
  onSubmit,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setText(taskToEdit?.text || '');
      setError(null);
    }
  }, [isOpen, taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = createTaskSchema.safeParse({ text });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Invalid input');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validation.data.text);
      setText('');
      onClose();
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Todo' : 'Edit Todo'}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a new todo item. Click save when you are done.'
              : 'Edit your todo item. Click save when you are done.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your task..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

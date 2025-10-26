import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('taskModal');
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
      const errorKey = validation.error.errors[0]?.message || 'invalidInput';
      setError(t(errorKey));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(validation.data.text);
      setText('');
      onClose();
    } catch (err) {
      setError(t('saveFailed'));
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
          <DialogTitle>{mode === 'add' ? t('addTitle') : t('editTitle')}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? t('addDescription') : t('editDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('placeholder')}
              className="min-h-[120px] resize-none"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-gray-300 hover:bg-gray-50"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSubmitting ? t('saving') : mode === 'add' ? t('add') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

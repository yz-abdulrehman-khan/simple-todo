import { cn } from './cn';

describe('cn utility', () => {
  it('should merge multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    expect(cn('base', true && 'active')).toBe('base active');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, 'class')).toBe('base class');
    expect(cn('base', null, 'class')).toBe('base class');
  });

  it('should handle arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn(['base'], 'extra')).toBe('base extra');
  });

  it('should handle objects with boolean values', () => {
    expect(cn({ base: true, hidden: false, visible: true })).toBe('base visible');
  });

  it('should return empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should merge complex Tailwind utilities', () => {
    expect(cn('bg-red-500 hover:bg-blue-500', 'bg-green-500')).toBe(
      'hover:bg-blue-500 bg-green-500'
    );
  });
});

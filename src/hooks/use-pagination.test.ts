import { renderHook, act } from '@testing-library/react';
import { usePagination } from './use-pagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(10);
    expect(result.current.totalItems).toBe(100);
    expect(result.current.totalPages).toBe(10);
  });

  it('should initialize with custom initial page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, initialPage: 5 }));

    expect(result.current.currentPage).toBe(5);
  });

  it('should initialize with custom items per page', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100, itemsPerPage: 20 }));

    expect(result.current.itemsPerPage).toBe(20);
    expect(result.current.totalPages).toBe(5);
  });

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 25, itemsPerPage: 10 }));

    expect(result.current.totalPages).toBe(3);
  });

  it('should handle zero items', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 0 }));

    expect(result.current.totalPages).toBe(0);
  });

  describe('canGoPrevious', () => {
    it('should be false on first page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      expect(result.current.canGoPrevious).toBe(false);
    });

    it('should be true on non-first page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100, initialPage: 2 }));

      expect(result.current.canGoPrevious).toBe(true);
    });
  });

  describe('canGoNext', () => {
    it('should be true when not on last page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      expect(result.current.canGoNext).toBe(true);
    });

    it('should be false on last page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100, initialPage: 10 }));

      expect(result.current.canGoNext).toBe(false);
    });
  });

  describe('goToPage', () => {
    it('should go to valid page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      act(() => {
        result.current.goToPage(5);
      });

      expect(result.current.currentPage).toBe(5);
    });

    it('should not go to page less than 1', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      act(() => {
        result.current.goToPage(0);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('should not go to page greater than total pages', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      act(() => {
        result.current.goToPage(15);
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('goToNextPage', () => {
    it('should increment page when not on last page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('should not increment page when on last page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100, initialPage: 10 }));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(10);
    });
  });

  describe('goToPreviousPage', () => {
    it('should decrement page when not on first page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100, initialPage: 5 }));

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(4);
    });

    it('should not decrement page when on first page', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }));

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('navigation flow', () => {
    it('should handle complete navigation cycle', () => {
      const { result } = renderHook(() => usePagination({ totalItems: 50 }));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(5);

      // Go to next page
      act(() => {
        result.current.goToNextPage();
      });
      expect(result.current.currentPage).toBe(2);

      // Go to specific page
      act(() => {
        result.current.goToPage(4);
      });
      expect(result.current.currentPage).toBe(4);

      // Go to previous page
      act(() => {
        result.current.goToPreviousPage();
      });
      expect(result.current.currentPage).toBe(3);
    });
  });

  describe('reactive totalPages', () => {
    it('should recalculate total pages when totalItems changes', () => {
      const { result, rerender } = renderHook(({ totalItems }) => usePagination({ totalItems }), {
        initialProps: { totalItems: 100 },
      });

      expect(result.current.totalPages).toBe(10);

      rerender({ totalItems: 50 });

      expect(result.current.totalPages).toBe(5);
    });
  });
});

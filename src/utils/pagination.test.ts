import { getPageNumbers } from './pagination';

describe('pagination utilities', () => {
  describe('getPageNumbers', () => {
    it('should return all page numbers when totalPages <= 7', () => {
      expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(getPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(getPageNumbers(1, 1)).toEqual([1]);
    });

    it('should show ellipsis and pages around current page when totalPages > 7', () => {
      // Current page at start
      expect(getPageNumbers(1, 10)).toEqual([1, 2, '...', 10]);
      expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, '...', 10]);
      expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('should show ellipsis on both sides when current page is in middle', () => {
      expect(getPageNumbers(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
      expect(getPageNumbers(6, 12)).toEqual([1, '...', 5, 6, 7, '...', 12]);
    });

    it('should show ellipsis before when current page is near end', () => {
      expect(getPageNumbers(8, 10)).toEqual([1, '...', 7, 8, 9, 10]);
      expect(getPageNumbers(9, 10)).toEqual([1, '...', 8, 9, 10]);
      expect(getPageNumbers(10, 10)).toEqual([1, '...', 9, 10]);
    });

    it('should handle edge case with exactly 8 pages', () => {
      expect(getPageNumbers(1, 8)).toEqual([1, 2, '...', 8]);
      expect(getPageNumbers(4, 8)).toEqual([1, '...', 3, 4, 5, '...', 8]);
      expect(getPageNumbers(5, 8)).toEqual([1, '...', 4, 5, 6, '...', 8]);
      expect(getPageNumbers(6, 8)).toEqual([1, '...', 5, 6, 7, 8]);
      expect(getPageNumbers(8, 8)).toEqual([1, '...', 7, 8]);
    });

    it('should always show first and last page', () => {
      const result1 = getPageNumbers(5, 20);
      expect(result1[0]).toBe(1);
      expect(result1[result1.length - 1]).toBe(20);

      const result2 = getPageNumbers(15, 20);
      expect(result2[0]).toBe(1);
      expect(result2[result2.length - 1]).toBe(20);
    });

    it('should not show duplicate page numbers', () => {
      const result = getPageNumbers(4, 10);
      const numberPages = result.filter((p) => typeof p === 'number');
      const uniquePages = new Set(numberPages);
      expect(numberPages.length).toBe(uniquePages.size);
    });

    it('should maintain correct order of pages', () => {
      const result = getPageNumbers(5, 15);
      const numberPages = result.filter((p) => typeof p === 'number') as number[];

      for (let i = 1; i < numberPages.length; i++) {
        expect(numberPages[i]!).toBeGreaterThan(numberPages[i - 1]!);
      }
    });
  });
});

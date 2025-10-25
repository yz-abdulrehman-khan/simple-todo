import { useState, useMemo } from 'react';
import type { PaginationState, PaginationControls } from '@/types';
import { PAGINATION_CONFIG } from '@/configs';

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  itemsPerPage?: number;
}

interface UsePaginationReturn extends PaginationState, PaginationControls {}

export const usePagination = ({
  totalItems,
  initialPage = PAGINATION_CONFIG.defaultPage,
  itemsPerPage = PAGINATION_CONFIG.defaultLimit,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  };
};

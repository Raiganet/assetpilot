'use client';

import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const startIndex = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  const endIndex = useMemo(
    () => Math.min(startIndex + pageSize, totalItems),
    [startIndex, pageSize, totalItems]
  );

  const canGoNext = page < totalPages;
  const canGoPrevious = page > 1;

  const nextPage = () => {
    if (canGoNext) setPage((p) => p + 1);
  };

  const previousPage = () => {
    if (canGoPrevious) setPage((p) => p - 1);
  };

  const goToPage = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  return {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToPage,
    canGoNext,
    canGoPrevious,
  };
};
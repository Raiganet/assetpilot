'use client';
import { useState, useMemo } from 'react';

export const usePagination = ({ totalItems, initialPage = 1, initialPageSize = 10 }: any) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);
  const canGoNext = page < totalPages;
  const canGoPrevious = page > 1;
  return { page, pageSize, totalPages, setPage, setPageSize, canGoNext, canGoPrevious };
};

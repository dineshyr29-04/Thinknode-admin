import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errorHandler';

// Custom hook for API calls with loading and error states
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCallFn) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCallFn();
      return response;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw errorInfo;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, request, clearError };
};

// Hook for paginated API calls
export const usePaginatedApi = (initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, error, request } = useApi();

  const fetchPage = useCallback(async (apiCallFn) => {
    const response = await request(() => 
      apiCallFn(page, pageSize)
    );
    
    if (response.totalPages !== undefined) {
      setTotalPages(response.totalPages);
    }
    
    return response;
  }, [page, pageSize, request]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    loading,
    error,
    fetchPage,
  };
};

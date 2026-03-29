// Centralized error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.status === 401) {
    return {
      type: 'AUTH_ERROR',
      message: 'Your session has expired. Please login again.',
    };
  }

  if (error.status === 403) {
    return {
      type: 'FORBIDDEN',
      message: 'You do not have permission to perform this action.',
    };
  }

  if (error.status === 404) {
    return {
      type: 'NOT_FOUND',
      message: 'Resource not found.',
    };
  }

  if (error.status === 400) {
    return {
      type: 'VALIDATION_ERROR',
      message: error.message || 'Invalid request data.',
      details: error.data?.errors,
    };
  }

  if (error.status === 500) {
    return {
      type: 'SERVER_ERROR',
      message: 'Server error. Please try again later.',
    };
  }

  if (error.message === 'Failed to fetch') {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
    };
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred.',
  };
};

// Toast notification helper (integrate with your UI library)
export const showError = (error, onError) => {
  const errorInfo = handleApiError(error);
  if (onError) {
    onError(errorInfo);
  }
  console.error(errorInfo);
};

export const showSuccess = (message, onSuccess) => {
  if (onSuccess) {
    onSuccess(message);
  }
};

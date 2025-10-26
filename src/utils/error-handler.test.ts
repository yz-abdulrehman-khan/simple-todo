import { handleApiError, getErrorMessage, isNetworkError } from './error-handler';

// Mock Response class for testing
class MockResponse {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string) {
    this.status = status;
    this.statusText = statusText;
  }
}

// Make MockResponse behave like Response for instanceof checks
global.Response = MockResponse as unknown as typeof Response;

describe('handleApiError', () => {
  it('should handle Response object with status and statusText', () => {
    const mockResponse = new MockResponse(404, 'Not Found');

    const result = handleApiError(mockResponse);

    expect(result).toEqual({
      message: 'Not Found',
      status: 404,
      statusText: 'Not Found',
    });
  });

  it('should handle Response object with empty statusText', () => {
    const mockResponse = new MockResponse(500, '');

    const result = handleApiError(mockResponse);

    expect(result).toEqual({
      message: 'An error occurred',
      status: 500,
      statusText: '',
    });
  });

  it('should handle Response object with status 200', () => {
    const mockResponse = new MockResponse(200, 'OK');

    const result = handleApiError(mockResponse);

    expect(result).toEqual({
      message: 'OK',
      status: 200,
      statusText: 'OK',
    });
  });

  it('should handle Error instance with message', () => {
    const mockError = new Error('Something went wrong');

    const result = handleApiError(mockError);

    expect(result).toEqual({
      message: 'Something went wrong',
      status: 0,
      statusText: 'Error',
    });
  });

  it('should handle Error instance with empty message', () => {
    const mockError = new Error('');

    const result = handleApiError(mockError);

    expect(result).toEqual({
      message: '',
      status: 0,
      statusText: 'Error',
    });
  });

  it('should handle TypeError', () => {
    const mockError = new TypeError('Type error occurred');

    const result = handleApiError(mockError);

    expect(result).toEqual({
      message: 'Type error occurred',
      status: 0,
      statusText: 'Error',
    });
  });

  it('should handle string error', () => {
    const result = handleApiError('Unknown error');

    expect(result).toEqual({
      message: 'An unexpected error occurred',
      status: 0,
      statusText: 'Unknown Error',
    });
  });

  it('should handle number error', () => {
    const result = handleApiError(42);

    expect(result).toEqual({
      message: 'An unexpected error occurred',
      status: 0,
      statusText: 'Unknown Error',
    });
  });

  it('should handle null error', () => {
    const result = handleApiError(null);

    expect(result).toEqual({
      message: 'An unexpected error occurred',
      status: 0,
      statusText: 'Unknown Error',
    });
  });

  it('should handle undefined error', () => {
    const result = handleApiError(undefined);

    expect(result).toEqual({
      message: 'An unexpected error occurred',
      status: 0,
      statusText: 'Unknown Error',
    });
  });

  it('should handle object error', () => {
    const result = handleApiError({ foo: 'bar' });

    expect(result).toEqual({
      message: 'An unexpected error occurred',
      status: 0,
      statusText: 'Unknown Error',
    });
  });
});

describe('getErrorMessage', () => {
  it('should extract message from Response object', () => {
    const mockResponse = new MockResponse(404, 'Not Found');

    const result = getErrorMessage(mockResponse);

    expect(result).toBe('Not Found');
  });

  it('should extract message from Error instance', () => {
    const mockError = new Error('Custom error message');

    const result = getErrorMessage(mockError);

    expect(result).toBe('Custom error message');
  });

  it('should return default message for unknown error', () => {
    const result = getErrorMessage('some string');

    expect(result).toBe('An unexpected error occurred');
  });

  it('should return default message for null', () => {
    const result = getErrorMessage(null);

    expect(result).toBe('An unexpected error occurred');
  });

  it('should handle Response with empty statusText', () => {
    const mockResponse = new MockResponse(500, '');

    const result = getErrorMessage(mockResponse);

    expect(result).toBe('An error occurred');
  });
});

describe('isNetworkError', () => {
  it('should return true for Error with "network" in message (lowercase)', () => {
    const error = new Error('network connection failed');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with "Network" in message (uppercase)', () => {
    const error = new Error('Network timeout');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with "NETWORK" in message (all caps)', () => {
    const error = new Error('NETWORK ERROR');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with "fetch" in message (lowercase)', () => {
    const error = new Error('fetch failed');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with "Fetch" in message (uppercase)', () => {
    const error = new Error('Fetch request failed');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with "FETCH" in message (all caps)', () => {
    const error = new Error('FETCH FAILED');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return true for Error with both "network" and "fetch"', () => {
    const error = new Error('Network fetch failed');

    expect(isNetworkError(error)).toBe(true);
  });

  it('should return false for Error without network keywords', () => {
    const error = new Error('Database connection failed');

    expect(isNetworkError(error)).toBe(false);
  });

  it('should return false for TypeError without network keywords', () => {
    const error = new TypeError('Type mismatch');

    expect(isNetworkError(error)).toBe(false);
  });

  it('should return false for string error', () => {
    expect(isNetworkError('network error')).toBe(false);
  });

  it('should return false for number error', () => {
    expect(isNetworkError(404)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isNetworkError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNetworkError(undefined)).toBe(false);
  });

  it('should return false for Response object', () => {
    const mockResponse = new MockResponse(404, 'Not Found');

    expect(isNetworkError(mockResponse)).toBe(false);
  });

  it('should return false for object', () => {
    expect(isNetworkError({ message: 'network error' })).toBe(false);
  });
});

import { httpClient } from './http-client';
import { API_BASE_URL } from '@/constants';

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

// Mock fetch globally
global.fetch = jest.fn();

describe('HttpClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await httpClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should make GET request with query params', async () => {
      const mockData = [{ id: 1 }];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await httpClient.get('/tasks', { page: 1, limit: 10, active: true });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/tasks?page=1&limit=10&active=true`,
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with body', async () => {
      const requestBody = { name: 'New Task' };
      const mockResponse = { id: 1, ...requestBody };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await httpClient.post('/tasks', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/tasks`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const requestBody = { name: 'Updated Task' };
      const mockResponse = { id: 1, ...requestBody };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await httpClient.put('/tasks/1', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/tasks/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PATCH requests', () => {
    it('should make successful PATCH request', async () => {
      const requestBody = { completed: true };
      const mockResponse = { id: 1, ...requestBody };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await httpClient.patch('/tasks/1', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/tasks/1`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = { success: true };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await httpClient.delete('/tasks/1');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/tasks/1`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling', () => {
    it('should throw error when response is not ok', async () => {
      const errorResponse = new MockResponse(404, 'Not Found');
      Object.assign(errorResponse, { ok: false });

      (global.fetch as jest.Mock).mockResolvedValue(errorResponse);

      await expect(httpClient.get('/not-found')).rejects.toBeDefined();
    });

    it('should throw error on network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(httpClient.get('/test')).rejects.toBeDefined();
    });
  });

  describe('Request configuration', () => {
    it('should include default headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle empty response body', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      const result = await httpClient.get('/test');

      expect(result).toBeNull();
    });

    it('should handle request without body for GET', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/test');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
    });
  });

  describe('URL building', () => {
    it('should build URL with no params', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/endpoint');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/endpoint`, expect.any(Object));
    });

    it('should build URL with multiple params', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/search', {
        query: 'test',
        page: 2,
        active: false,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/search?query=test&page=2&active=false`,
        expect.any(Object)
      );
    });

    it('should handle params with special characters', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await httpClient.get('/search', { query: 'test & special' });

      const url = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(url).toContain('test+%26+special');
    });
  });
});

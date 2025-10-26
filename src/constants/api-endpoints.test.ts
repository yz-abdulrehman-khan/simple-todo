import { API_BASE_URL, API_ENDPOINTS } from './api-endpoints';

describe('API_BASE_URL', () => {
  it('should have correct base URL', () => {
    expect(API_BASE_URL).toBe('http://localhost:3001');
  });
});

describe('API_ENDPOINTS', () => {
  it('should have TASKS endpoint', () => {
    expect(API_ENDPOINTS.TASKS).toBe('/tasks');
  });

  it('should have COUNTS endpoint', () => {
    expect(API_ENDPOINTS.COUNTS).toBe('/counts');
  });

  describe('TASK_BY_ID', () => {
    it('should generate correct path for task ID 1', () => {
      expect(API_ENDPOINTS.TASK_BY_ID(1)).toBe('/tasks/1');
    });

    it('should generate correct path for task ID 42', () => {
      expect(API_ENDPOINTS.TASK_BY_ID(42)).toBe('/tasks/42');
    });

    it('should generate correct path for task ID 0', () => {
      expect(API_ENDPOINTS.TASK_BY_ID(0)).toBe('/tasks/0');
    });

    it('should generate correct path for negative task ID', () => {
      expect(API_ENDPOINTS.TASK_BY_ID(-1)).toBe('/tasks/-1');
    });

    it('should generate correct path for large task ID', () => {
      expect(API_ENDPOINTS.TASK_BY_ID(999999)).toBe('/tasks/999999');
    });
  });
});

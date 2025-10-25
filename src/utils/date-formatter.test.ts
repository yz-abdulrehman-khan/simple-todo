import { formatDate, formatDateTime, formatRelativeTime } from './date-formatter';

describe('date-formatter', () => {
  describe('formatDate', () => {
    it('should format valid date string', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/Jan\s+15,\s+2024/);
    });

    it('should handle different date formats', () => {
      const result = formatDate('2024-12-25T00:00:00Z');
      expect(result).toMatch(/Dec\s+25,\s+2024/);
    });

    it('should return "Invalid date" for invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('Invalid date');
      expect(formatDate('')).toBe('Invalid date');
      expect(formatDate('not-a-date')).toBe('Invalid date');
    });
  });

  describe('formatDateTime', () => {
    it('should format valid datetime string with time', () => {
      const result = formatDateTime('2024-01-15T10:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).toMatch(/\d{1,2}:\d{2}\s*[AP]M/);
    });

    it('should handle different datetime formats', () => {
      const result = formatDateTime('2024-12-25T12:00:00Z');
      expect(result).toContain('Dec');
      expect(result).toContain('2024');
    });

    it('should return "Invalid date" for invalid datetime string', () => {
      expect(formatDateTime('invalid-datetime')).toBe('Invalid date');
      expect(formatDateTime('')).toBe('Invalid date');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Just now" for recent dates (< 1 minute)', () => {
      const now = new Date('2024-01-15T12:00:00Z').toISOString();
      expect(formatRelativeTime(now)).toBe('Just now');

      const thirtySecondsAgo = new Date('2024-01-15T11:59:30Z').toISOString();
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');
    });

    it('should return minutes ago for times < 1 hour', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z').toISOString();
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');

      const thirtyMinutesAgo = new Date('2024-01-15T11:30:00Z').toISOString();
      expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30m ago');
    });

    it('should return hours ago for times < 24 hours', () => {
      const twoHoursAgo = new Date('2024-01-15T10:00:00Z').toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

      const twentyHoursAgo = new Date('2024-01-14T16:00:00Z').toISOString();
      expect(formatRelativeTime(twentyHoursAgo)).toBe('20h ago');
    });

    it('should return days ago for times < 7 days', () => {
      const twoDaysAgo = new Date('2024-01-13T12:00:00Z').toISOString();
      expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');

      const sixDaysAgo = new Date('2024-01-09T12:00:00Z').toISOString();
      expect(formatRelativeTime(sixDaysAgo)).toBe('6d ago');
    });

    it('should return formatted date for times >= 7 days', () => {
      const eightDaysAgo = new Date('2024-01-07T12:00:00Z').toISOString();
      const result = formatRelativeTime(eightDaysAgo);
      expect(result).toMatch(/Jan\s+7,\s+2024/);

      const monthAgo = new Date('2023-12-15T12:00:00Z').toISOString();
      const result2 = formatRelativeTime(monthAgo);
      expect(result2).toMatch(/Dec\s+15,\s+2023/);
    });

    it('should return "Invalid date" for invalid date string', () => {
      expect(formatRelativeTime('invalid-date')).toBe('Invalid date');
      expect(formatRelativeTime('')).toBe('Invalid date');
    });
  });
});

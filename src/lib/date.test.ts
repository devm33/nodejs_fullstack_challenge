import { dateForAge, yearsSince } from "./date";

jest.useFakeTimers().setSystemTime(new Date('2023-01-02'));

describe('date', () => {
  describe('dateForAge', () => {
    it('returns date given years ago', () => {
      expect(dateForAge(23)).toBe('2000-01-02');
    });
  });

  describe('yearsSince', () => {
    it('returns years since a given date', () => {
      expect(yearsSince('2000-01-01')).toBe(23);
    });
  });
});
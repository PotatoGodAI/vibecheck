import { describe, expect, it } from 'vitest';
import { average, cleanText, reviewComplete, safeUrl } from './utils';
describe('UI boundary validation', () => {
  it('permits web URLs and rejects unsafe schemes', () => {
    expect(safeUrl('https://vibecheck.app/x')).toContain('https://');
    expect(safeUrl('javascript:alert(1)')).toBeNull();
  });
  it('strips angle brackets and limits text', () =>
    expect(cleanText(' <hello> ', 5)).toBe('hello'));
  it('requires all written review fields', () => {
    const base = {
      impression: 'Clear',
      clarity: 4 as const,
      trust: 4 as const,
      usability: 3 as const,
      tryIt: 'Yes' as const,
      reason: 'Useful',
      improvement: 'Clarify pricing',
      customAnswers: [],
    };
    expect(reviewComplete(base)).toBe(true);
    expect(reviewComplete({ ...base, reason: ' ' })).toBe(false);
  });
  it('averages safely', () => {
    expect(average([3, 4, 5])).toBe(4);
    expect(average([])).toBe(0);
  });
});

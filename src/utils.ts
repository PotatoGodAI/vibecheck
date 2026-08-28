import type { ReviewDraft } from './types';
export const safeUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};
export const cleanText = (value: string, max = 500) =>
  value.replace(/[<>]/g, '').trim().slice(0, max);
export const reviewComplete = (r: ReviewDraft) =>
  Boolean(
    cleanText(r.impression, 200) && cleanText(r.reason, 300) && cleanText(r.improvement, 500),
  );
export const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

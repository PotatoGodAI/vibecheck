import type { Post, Review } from '../types';
const key = 'vibecheck-demo-v1';
export type LocalState = {
  saved: string[];
  vibed: string[];
  reviews: Review[];
  posts: Post[];
  notifications: string[];
};
const initial: LocalState = {
  saved: [],
  vibed: [],
  reviews: [],
  posts: [],
  notifications: ['Mina marked your review helpful', 'Quiet Tab posted a new version'],
};
export const localStore = {
  read(): LocalState {
    try {
      return { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') };
    } catch {
      return initial;
    }
  },
  write(state: LocalState) {
    localStorage.setItem(key, JSON.stringify(state));
  },
  clear() {
    localStorage.removeItem(key);
  },
};

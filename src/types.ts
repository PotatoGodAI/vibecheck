export type Stage = 'Idea' | 'Prototype' | 'Beta' | 'Live';
export type Rating = 1 | 2 | 3 | 4 | 5;
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  credibility: number;
  credits: number;
}
export interface Review {
  id: string;
  postId: string;
  author: User;
  impression: string;
  clarity: Rating;
  trust: Rating;
  usability: Rating;
  tryIt: 'Yes' | 'Maybe' | 'No';
  reason: string;
  improvement: string;
  implemented: boolean;
  createdAt: string;
}
export interface Comment {
  id: string;
  author: User;
  body: string;
  createdAt: string;
  replyTo?: string;
}
export interface Post {
  id: string;
  creator: User;
  title: string;
  pitch: string;
  url: string;
  image: string;
  stage: Stage;
  version: string;
  chips: string[];
  context: string;
  customQuestions: string[];
  vibes: number;
  createdAt: string;
  reviewCount: number;
  commentCount: number;
  trending: number;
  versions: string[];
}
export interface ReviewDraft {
  impression: string;
  clarity: Rating;
  trust: Rating;
  usability: Rating;
  tryIt: 'Yes' | 'Maybe' | 'No';
  reason: string;
  improvement: string;
  customAnswers: string[];
}

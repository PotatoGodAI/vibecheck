export type View =
  | { kind: 'feed' }
  | { kind: 'post'; id: string }
  | { kind: 'create' }
  | { kind: 'profile' }
  | { kind: 'saved' }
  | { kind: 'plans' }
  | { kind: 'auth' };

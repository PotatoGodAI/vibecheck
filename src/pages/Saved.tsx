import { Bookmark } from 'lucide-react';
import type { Post } from '../types';
import type { View } from '../view';

export function Saved({ posts, go }: { posts: Post[]; go: (v: View) => void }) {
  return (
    <section className="page">
      <p className="eyebrow">Your collection</p>
      <h1>Saved builds</h1>
      {posts.length ? (
        <div className="mini-grid">
          {posts.map((p) => (
            <button className="mini" onClick={() => go({ kind: 'post', id: p.id })} key={p.id}>
              <img src={p.image} />
              <span>
                <b>{p.title}</b>
                <small>{p.pitch}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Bookmark />
          <h2>Nothing saved yet</h2>
          <p>Save promising builds to revisit their progress.</p>
          <button className="btn" onClick={() => go({ kind: 'feed' })}>
            Explore builds
          </button>
        </div>
      )}
    </section>
  );
}

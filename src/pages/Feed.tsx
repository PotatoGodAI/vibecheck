import { Bookmark, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { Post } from '../types';
import type { View } from '../view';
import { Avatar } from '../components/Avatar';

export function Feed({
  posts,
  filter,
  setFilter,
  go,
  saved,
  vibed,
  toggleSaved,
  toggleVibe,
}: {
  posts: Post[];
  filter: string;
  setFilter: (s: string) => void;
  go: (v: View) => void;
  saved: string[];
  vibed: string[];
  toggleSaved: (s: string) => void;
  toggleVibe: (s: string) => void;
}) {
  const shown = useMemo(
    () =>
      filter === 'New'
        ? [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : filter === 'Trending'
          ? [...posts].sort((a, b) => b.trending - a.trending)
          : filter === 'Needs Feedback'
            ? posts.filter((p) => p.reviewCount < 12)
            : posts,
    [posts, filter],
  );
  return (
    <section className="feed">
      <div className="hero">
        <p className="eyebrow">Discover what people are building</p>
        <h1>
          Fresh builds.
          <br />
          <em>Thoughtful feedback.</em>
        </h1>
        <p>See something interesting? Give the kind of feedback you’d want to receive.</p>
      </div>
      <div className="filters" role="tablist">
        {['For You', 'New', 'Trending', 'Needs Feedback'].map((f) => (
          <button role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} key={f}>
            {f}
          </button>
        ))}
      </div>
      {shown.map((p) => (
        <article className="card" key={p.id}>
          <button className="image-button" onClick={() => go({ kind: 'post', id: p.id })}>
            <img src={p.image} alt={`${p.title} product preview`} />
            <span className="stage">
              {p.stage} · {p.version}
            </span>
          </button>
          <div className="creator">
            <Avatar text={p.creator.avatar} />
            <span>
              <b>{p.creator.name}</b>
              <small>@{p.creator.handle}</small>
            </span>
            <button className="icon save" aria-label="Save post" onClick={() => toggleSaved(p.id)}>
              <Bookmark fill={saved.includes(p.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <h2>{p.title}</h2>
          <p className="pitch">{p.pitch}</p>
          <div className="chips">
            {p.chips.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="card-foot">
            <div>
              <button
                className={vibed.includes(p.id) ? 'vibed' : ''}
                onClick={() => toggleVibe(p.id)}
              >
                <Heart fill={vibed.includes(p.id) ? 'currentColor' : 'none'} />{' '}
                {p.vibes + (vibed.includes(p.id) ? 1 : 0)} <span>Passes the vibe</span>
              </button>
              <span>
                <MessageCircle /> {p.reviewCount} reviews · {p.commentCount} comments
              </span>
            </div>
            <button className="btn" onClick={() => go({ kind: 'post', id: p.id })}>
              Review this build <ChevronRight />
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

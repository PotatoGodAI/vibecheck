import type { Post } from '../types';
import type { View } from '../view';
import { demoUser } from '../data';
import { Avatar } from '../components/Avatar';

export function Profile({ posts, go }: { posts: Post[]; go: (v: View) => void }) {
  return (
    <section className="page">
      <div className="profile-head">
        <Avatar text={demoUser.avatar} />
        <div>
          <h1>{demoUser.name}</h1>
          <p>
            @{demoUser.handle} · {demoUser.bio}
          </p>
        </div>
        <button className="btn outline">Edit profile</button>
      </div>
      <div className="stats">
        <div>
          <b>86</b>
          <span>Credibility</span>
        </div>
        <div>
          <b>14</b>
          <span>Helpful reviews</span>
        </div>
        <div>
          <b>{demoUser.credits}</b>
          <span>Credits</span>
        </div>
      </div>
      <div className="tabs">
        <button className="active">Builds</button>
        <button>Reviews</button>
        <button onClick={() => go({ kind: 'saved' })}>Saved</button>
      </div>
      <div className="mini-grid">
        {posts.slice(0, 2).map((p) => (
          <button className="mini" onClick={() => go({ kind: 'post', id: p.id })} key={p.id}>
            <img src={p.image} />
            <span>
              <b>{p.title}</b>
              <small>
                {p.stage} · {p.reviewCount} reviews
              </small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

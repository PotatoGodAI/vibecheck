import { useState } from 'react';
import { ArrowLeft, Bookmark, Check, ExternalLink, Flag, Heart, Send } from 'lucide-react';
import { demoUser, seedReview } from '../data';
import { localStore } from '../services/store';
import type { Post, ReviewDraft } from '../types';
import { cleanText, reviewComplete } from '../utils';
import { Avatar } from '../components/Avatar';

const blank: ReviewDraft = {
  impression: '',
  clarity: 3,
  trust: 3,
  usability: 3,
  tryIt: 'Maybe',
  reason: '',
  improvement: '',
  customAnswers: [],
};

export function Detail({
  post,
  back,
  local,
  setLocal,
  saved,
  toggleSaved,
  vibed,
  toggleVibe,
}: {
  post: Post;
  back: () => void;
  local: ReturnType<typeof localStore.read>;
  setLocal: React.Dispatch<React.SetStateAction<ReturnType<typeof localStore.read>>>;
  saved: boolean;
  toggleSaved: () => void;
  vibed: boolean;
  toggleVibe: () => void;
}) {
  const existing = local.reviews.find((r) => r.postId === post.id);
  const [draft, setDraft] = useState(blank);
  const [submitted, setSubmitted] = useState(Boolean(existing));
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const submit = () => {
    if (!reviewComplete(draft)) return;
    setLocal((s) => ({
      ...s,
      reviews: [
        ...s.reviews,
        {
          ...draft,
          id: crypto.randomUUID(),
          postId: post.id,
          author: demoUser,
          implemented: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setSubmitted(true);
  };
  return (
    <section className="detail">
      <button className="back" onClick={back}>
        <ArrowLeft /> Back to builds
      </button>
      <div className="detail-grid">
        <div className="project">
          <img className="detail-image" src={post.image} alt={`${post.title} preview`} />
          <div className="project-head">
            <div>
              <span className="pill">
                {post.stage} · {post.version}
              </span>
              <h1>{post.title}</h1>
              <p className="pitch">{post.pitch}</p>
            </div>
            <a className="btn outline" href={post.url} target="_blank" rel="noreferrer">
              Visit project <ExternalLink />
            </a>
          </div>
          <div className="creator bio">
            <Avatar text={post.creator.avatar} />
            <span>
              <b>
                {post.creator.name} <small>· @{post.creator.handle}</small>
              </b>
              <p>{post.creator.bio}</p>
            </span>
          </div>
          <div className="context">
            <h3>Behind the build</h3>
            <p>{post.context}</p>
          </div>
          <div className="engage">
            <button className={vibed ? 'vibed' : ''} onClick={toggleVibe}>
              <Heart fill={vibed ? 'currentColor' : 'none'} /> {post.vibes + (vibed ? 1 : 0)} Passes
              the vibe
            </button>
            <button onClick={toggleSaved}>
              <Bookmark fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() =>
                alert('Report received. Thanks for helping keep VibeCheck constructive.')
              }
            >
              <Flag /> Report
            </button>
          </div>
          <div className="versions">
            <h3>Version history</h3>
            {post.versions.map((v) => (
              <p key={v}>
                <Check /> {v}
              </p>
            ))}
          </div>
        </div>
        <aside className="review-panel">
          {!submitted ? (
            <ReviewForm post={post} draft={draft} setDraft={setDraft} submit={submit} />
          ) : (
            <Results
              post={post}
              current={existing || local.reviews.find((r) => r.postId === post.id)}
              setLocal={setLocal}
              comments={comments}
              comment={comment}
              setComment={setComment}
              addComment={() => {
                const x = cleanText(comment, 300);
                if (x) {
                  setComments((c) => [...c, x]);
                  setComment('');
                }
              }}
            />
          )}
        </aside>
      </div>
    </section>
  );
}
function Rating({
  label,
  value,
  set,
}: {
  label: string;
  value: number;
  set: (n: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            className={value === n ? 'active' : ''}
            onClick={() => set(n as 1 | 2 | 3 | 4 | 5)}
            key={n}
            aria-label={`${label}: ${n} out of 5`}
          >
            {n}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function ReviewForm({
  post,
  draft,
  setDraft,
  submit,
}: {
  post: Post;
  draft: ReviewDraft;
  setDraft: React.Dispatch<React.SetStateAction<ReviewDraft>>;
  submit: () => void;
}) {
  const update = (x: Partial<ReviewDraft>) => setDraft((d) => ({ ...d, ...x }));
  return (
    <div>
      <p className="eyebrow">Private until you submit</p>
      <h2>Review this build</h2>
      <p className="muted">
        Your first look is valuable. Prior feedback is hidden to keep it honest.
      </p>
      <label>
        First impression
        <textarea
          value={draft.impression}
          onChange={(e) => update({ impression: e.target.value })}
          placeholder="What stood out in the first few seconds?"
          maxLength={200}
        />
      </label>
      <div className="rating-grid">
        <Rating label="Clarity" value={draft.clarity} set={(n) => update({ clarity: n })} />
        <Rating label="Trust" value={draft.trust} set={(n) => update({ trust: n })} />
        <Rating label="Usability" value={draft.usability} set={(n) => update({ usability: n })} />
      </div>
      <fieldset>
        <legend>Would you try it?</legend>
        <div className="choice">
          {['Yes', 'Maybe', 'No'].map((x) => (
            <button
              type="button"
              className={draft.tryIt === x ? 'active' : ''}
              onClick={() => update({ tryIt: x as 'Yes' | 'Maybe' | 'No' })}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        Why?
        <textarea
          value={draft.reason}
          onChange={(e) => update({ reason: e.target.value })}
          placeholder="What shaped your answer?"
        />
      </label>
      <label>
        One actionable improvement
        <textarea
          value={draft.improvement}
          onChange={(e) => update({ improvement: e.target.value })}
          placeholder="Try to be specific and kind."
        />
      </label>
      {post.customQuestions.map((q, i) => (
        <label key={q}>
          {q}
          <textarea
            onChange={(e) => {
              const a = [...draft.customAnswers];
              a[i] = e.target.value;
              update({ customAnswers: a });
            }}
            placeholder="Optional creator question"
          />
        </label>
      ))}
      <button className="btn wide" disabled={!reviewComplete(draft)} onClick={submit}>
        Submit & reveal feedback
      </button>
    </div>
  );
}
function Results({
  post,
  current,
  setLocal,
  comments,
  comment,
  setComment,
  addComment,
}: {
  post: Post;
  current: any;
  setLocal: any;
  comments: string[];
  comment: string;
  setComment: (s: string) => void;
  addComment: () => void;
}) {
  const [implemented, setImplemented] = useState(false);
  return (
    <div>
      <p className="eyebrow">Community pulse</p>
      <h2>Feedback revealed</h2>
      <div className="score-row">
        {[
          ['Clarity', 4.4],
          ['Trust', 4.1],
          ['Usability', 4.2],
        ].map(([x, n]) => (
          <div key={x}>
            <b>{n}</b>
            <span>{x}</span>
          </div>
        ))}
      </div>
      <div className="try">
        <b>72%</b> would try it <span>18% maybe · 10% no</span>
      </div>
      <h3>Suggestions</h3>
      <div className="review-card">
        <div className="creator">
          <Avatar text={current?.author.avatar || demoUser.avatar} />
          <b>{current?.author.name || 'You'}</b>
        </div>
        <p>“{current?.improvement || seedReview.improvement}”</p>
        <button
          className={implemented ? 'implemented' : ''}
          onClick={() => {
            setImplemented(true);
            if (current)
              setLocal((s: any) => ({
                ...s,
                reviews: s.reviews.map((r: any) =>
                  r.id === current.id ? { ...r, implemented: true } : r,
                ),
              }));
          }}
        >
          <Check /> {implemented ? 'Implemented' : 'Mark implemented'}
        </button>
      </div>
      <div className="review-card">
        <div className="creator">
          <Avatar text={seedReview.author.avatar} />
          <b>{seedReview.author.name}</b>
        </div>
        <p>“{seedReview.improvement}”</p>
      </div>
      <h3>Conversation · {post.commentCount + comments.length}</h3>
      {comments.map((c, i) => (
        <div className="comment" key={i}>
          <Avatar text={demoUser.avatar} />
          <p>
            <b>You</b>
            <br />
            {c}
            <br />
            <button>Reply</button>
          </p>
        </div>
      ))}
      <div className="commentbox">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a constructive comment…"
        />
        <button className="icon" onClick={addComment}>
          <Send />
        </button>
      </div>
    </div>
  );
}

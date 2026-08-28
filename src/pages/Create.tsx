import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { demoUser } from '../data';
import type { Post, Stage } from '../types';
import { cleanText, safeUrl } from '../utils';

export function Create({ cancel, publish }: { cancel: () => void; publish: (p: Post) => void }) {
  const [data, setData] = useState({
    title: '',
    url: '',
    pitch: '',
    image: '',
    stage: 'Prototype' as Stage,
    version: 'v0.1',
    chips: ['First impression'],
    context: '',
    questions: [''],
  });
  const [error, setError] = useState('');
  const set = (x: any) => setData((d) => ({ ...d, ...x }));
  const submit = () => {
    if (
      data.title.length < 3 ||
      data.pitch.length < 10 ||
      !safeUrl(data.url) ||
      !safeUrl(data.image)
    ) {
      setError('Add a title, a clear pitch, and valid https:// project and image URLs.');
      return;
    }
    publish({
      id: `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      creator: demoUser,
      title: cleanText(data.title, 80),
      pitch: cleanText(data.pitch, 160),
      url: safeUrl(data.url)!,
      image: safeUrl(data.image)!,
      stage: data.stage,
      version: cleanText(data.version, 12),
      chips: data.chips,
      context: cleanText(data.context, 700),
      customQuestions: data.questions.map((x) => cleanText(x, 150)).filter(Boolean),
      vibes: 0,
      reviewCount: 0,
      commentCount: 0,
      trending: 0,
      createdAt: new Date().toISOString(),
      versions: [`${data.version} · First shared build`],
    });
  };
  return (
    <section className="create">
      <button className="back" onClick={cancel}>
        <ArrowLeft /> Cancel
      </button>
      <div className="form-head">
        <p className="eyebrow">Share your work</p>
        <h1>Put your build in front of thoughtful humans.</h1>
        <p>You’ll spend 2 credits. Great prompts receive better feedback.</p>
      </div>
      <div className="create-grid">
        <div className="form-card">
          <h2>About the build</h2>
          <label>
            Project title
            <input
              value={data.title}
              maxLength={80}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="e.g. Quiet Tab"
            />
          </label>
          <label>
            Live URL
            <input
              value={data.url}
              onChange={(e) => set({ url: e.target.value })}
              placeholder="https://…"
            />
          </label>
          <label>
            One-line pitch
            <textarea
              value={data.pitch}
              maxLength={160}
              onChange={(e) => set({ pitch: e.target.value })}
              placeholder="What does it help someone do?"
            />
          </label>
          <div className="field-row">
            <label>
              Stage
              <select value={data.stage} onChange={(e) => set({ stage: e.target.value as Stage })}>
                {['Idea', 'Prototype', 'Beta', 'Live'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Version
              <input value={data.version} onChange={(e) => set({ version: e.target.value })} />
            </label>
          </div>
          <label>
            Screenshot URL
            <input
              value={data.image}
              onChange={(e) => set({ image: e.target.value })}
              placeholder="https://…/screenshot.jpg"
            />
          </label>
          {safeUrl(data.image) && (
            <img className="preview" src={data.image} alt="Screenshot preview" />
          )}
          <label>
            Context for reviewers
            <textarea
              value={data.context}
              onChange={(e) => set({ context: e.target.value })}
              placeholder="What did you make, and what are you uncertain about?"
            />
          </label>
        </div>
        <div className="form-card">
          <h2>Ask for useful feedback</h2>
          <p className="muted">Choose up to three focus areas.</p>
          <div className="chip-picker">
            {[
              'First impression',
              'Clarity',
              'Trust',
              'Navigation',
              'Mobile flow',
              'Visual design',
            ].map((x) => (
              <button
                className={data.chips.includes(x) ? 'active' : ''}
                onClick={() =>
                  set({
                    chips: data.chips.includes(x)
                      ? data.chips.filter((c) => c !== x)
                      : data.chips.length < 3
                        ? [...data.chips, x]
                        : data.chips,
                  })
                }
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <label>
            Custom question
            <input
              value={data.questions[0]}
              onChange={(e) => set({ questions: [e.target.value] })}
              placeholder="Optional: What should I ask reviewers?"
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="btn wide" onClick={submit}>
            Publish build · 2 credits
          </button>
          <small>Your post is stored only in this browser while in demo mode.</small>
        </div>
      </div>
    </section>
  );
}

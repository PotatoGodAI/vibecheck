import { useEffect, useState } from 'react';
import { Bell, Menu, Moon, Plus, Search, Sun } from 'lucide-react';
import { demoUser, posts as seeded } from './data';
import { firebaseConfigured } from './services/firebase';
import { localStore } from './services/store';
import { Avatar } from './components/Avatar';
import { Auth } from './pages/Auth';
import { Create } from './pages/Create';
import { Detail } from './pages/Detail';
import { Feed } from './pages/Feed';
import { Plans } from './pages/Plans';
import { Profile } from './pages/Profile';
import { Saved } from './pages/Saved';
import type { View } from './view';
import './styles.css';

function App() {
  const [view, setView] = useState<View>({ kind: 'feed' });
  const [filter, setFilter] = useState('For You');
  const [local, setLocal] = useState(localStore.read);
  const [theme, setTheme] = useState(localStorage.getItem('vibecheck-theme') || 'system');
  const [notices, setNotices] = useState(false);
  const allPosts = [...local.posts, ...seeded];
  useEffect(() => {
    localStore.write(local);
  }, [local]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('vibecheck-theme', theme);
  }, [theme]);
  const go = (next: View) => {
    setView(next);
    scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleSaved = (id: string) =>
    setLocal((s) => ({
      ...s,
      saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
    }));
  const toggleVibe = (id: string) =>
    setLocal((s) => ({
      ...s,
      vibed: s.vibed.includes(id) ? s.vibed.filter((x) => x !== id) : [...s.vibed, id],
    }));
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <button className="brand" onClick={() => go({ kind: 'feed' })}>
          <i>V</i> VibeCheck
        </button>
        <nav aria-label="Primary">
          <button onClick={() => go({ kind: 'feed' })}>Explore</button>
          <button onClick={() => go({ kind: 'saved' })}>Saved</button>
          <button onClick={() => go({ kind: 'plans' })}>
            Credits <b>{demoUser.credits}</b>
          </button>
        </nav>
        <div className="actions">
          <button className="icon" aria-label="Search">
            <Search />
          </button>
          <div className="popover-wrap">
            <button
              className="icon"
              aria-label="Notifications"
              onClick={() => setNotices(!notices)}
            >
              <Bell />
              <span className="dot" />
            </button>
            {notices && (
              <div className="popover">
                <strong>Notifications</strong>
                {local.notifications.map((n) => (
                  <p key={n}>{n}</p>
                ))}
                <small>You’re all caught up.</small>
              </div>
            )}
          </div>
          <button
            className="theme"
            onClick={() =>
              setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')
            }
            aria-label={`Theme: ${theme}`}
          >
            {theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <span>◐</span>}
          </button>
          <button className="btn small desktop" onClick={() => go({ kind: 'create' })}>
            <Plus /> Share a build
          </button>
          <button className="user" onClick={() => go({ kind: 'profile' })}>
            <Avatar text={demoUser.avatar} />
          </button>
          <button className="icon mobile">
            <Menu />
          </button>
        </div>
      </header>
      <div className="mode">
        {firebaseConfigured ? 'Connected to Firebase' : 'DEMO MODE · saved locally in this browser'}
      </div>
      <main id="main">
        {view.kind === 'feed' && (
          <Feed
            posts={allPosts}
            filter={filter}
            setFilter={setFilter}
            go={go}
            saved={local.saved}
            vibed={local.vibed}
            toggleSaved={toggleSaved}
            toggleVibe={toggleVibe}
          />
        )}{' '}
        {view.kind === 'post' && (
          <Detail
            post={allPosts.find((p) => p.id === view.id)!}
            back={() => go({ kind: 'feed' })}
            local={local}
            setLocal={setLocal}
            saved={local.saved.includes(view.id)}
            toggleSaved={() => toggleSaved(view.id)}
            vibed={local.vibed.includes(view.id)}
            toggleVibe={() => toggleVibe(view.id)}
          />
        )}{' '}
        {view.kind === 'create' && (
          <Create
            cancel={() => go({ kind: 'feed' })}
            publish={(p) => {
              setLocal((s) => ({ ...s, posts: [p, ...s.posts] }));
              go({ kind: 'post', id: p.id });
            }}
          />
        )}
        {view.kind === 'profile' && <Profile posts={allPosts} go={go} />}{' '}
        {view.kind === 'saved' && (
          <Saved posts={allPosts.filter((p) => local.saved.includes(p.id))} go={go} />
        )}{' '}
        {view.kind === 'plans' && <Plans />}
        {view.kind === 'auth' && <Auth />}
      </main>
      <footer>
        <span>
          <b>VibeCheck</b> · feedback that helps you ship
        </span>
        <span>Community guidelines · Privacy · © 2026</span>
      </footer>
    </>
  );
}

export default App;

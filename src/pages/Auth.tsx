export function Auth() {
  return (
    <section className="auth">
      <div>
        <p className="eyebrow">Welcome to VibeCheck</p>
        <h1>Build better with people.</h1>
        <p className="muted">Sign in to share work and leave feedback.</p>
        <button className="btn outline wide">Continue with Google</button>
        <span className="divider">or</span>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button className="btn wide">Sign in</button>
        <p className="notice">
          <b>Demo mode</b>
          <br />
          No real authentication occurred. You’re browsing as Alex, a safe local demo user.
        </p>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { payMongoProvider } from '../services/payments';

export function Plans() {
  const [message, setMessage] = useState('');
  return (
    <section className="page plans">
      <p className="eyebrow">Plans & credits</p>
      <h1>Feedback that keeps ideas moving.</h1>
      <p>Earn credits by leaving quality reviews, or choose Pro for a steady monthly balance.</p>
      <div className="plan-grid">
        <div className="plan">
          <h2>Free</h2>
          <b>$0</b>
          <p>Forever</p>
          <ul>
            <li>2 build posts per month</li>
            <li>Earn credits through reviews</li>
            <li>Community feedback</li>
          </ul>
          <button className="btn outline">Current plan</button>
        </div>
        <div className="plan pro">
          <span className="pill">For frequent shippers</span>
          <h2>Pro</h2>
          <b>₱399</b>
          <p>per month</p>
          <ul>
            <li>20 credits every month</li>
            <li>Version feedback history</li>
            <li>Priority discovery window</li>
          </ul>
          <button
            className="btn"
            onClick={async () => {
              try {
                await payMongoProvider.checkout('pro');
              } catch (e) {
                setMessage((e as Error).message);
              }
            }}
            disabled={!payMongoProvider.available}
          >
            Checkout unavailable
          </button>
        </div>
      </div>
      <div className="notice">
        <b>PayMongo-ready, safely disabled</b>
        <p>
          {message ||
            'Checkout becomes available after a server-side PayMongo integration is configured. Secret keys never belong in this client.'}
        </p>
      </div>
    </section>
  );
}

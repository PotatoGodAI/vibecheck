# VibeCheck

A production-minded MVP for fast, structured human feedback on websites and apps. The interface is a spacious visual showcase with a responsive feed, focused project detail, blind review flow, creator tools, profiles, local notifications, saved builds, moderation affordances, version history, and credits/plans.

## Quick start

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open the URL printed by Vite. Empty Firebase variables intentionally start **Demo Mode**. Data is seeded, and reviews, created posts, saves, reactions, and notifications persist in browser `localStorage`. Clear site data to reset it. No account or payment is created in demo mode.

## Scripts

- `npm run dev` — local Vite server
- `npm test` — Vitest unit tests
- `npm run build` — strict TypeScript check and production build
- `npm run preview` — serve the production build locally
- `npm run format` — format source and configuration files with Prettier
- `npm run format:check` — verify formatting without changing files

## Architecture

`src/types.ts` is the domain contract. `src/services/store.ts` is the deliberately small local persistence adapter. `src/services/firebase.ts` initializes Auth, Firestore, and Storage only when the public web configuration is complete; it exposes email/password and Google Auth hooks. The UI currently uses the local adapter so the repository always runs. In connected mode, implement a repository matching the same typed models and subscribe with Firestore listeners, then select it at the composition root. This boundary avoids Firebase concerns inside display components.

Review content is not rendered until the current user submits; this is enforced in UI state for the MVP. In production, enforce blind review access in a callable Cloud Function or server endpoint as Firestore read rules cannot conditionally hide fields in a document. Server timestamps, App Check, rate limiting, pagination, image moderation, and admin custom claims are recommended before public launch.

## Firebase setup

1. Create a Firebase project and Web App. Enable **Email/Password** and **Google** in Authentication.
2. Create Firestore and Storage, then copy `.env.example` to `.env.local` and fill the public `VITE_FIREBASE_*` values. Firebase web config is public identification, not a server credential.
3. Install the Firebase CLI, sign in, select your project, and deploy policy/config:
   ```bash
   firebase use YOUR_PROJECT_ID
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
4. Add your production domain to Authentication authorized domains. Configure App Check and monitoring.

Never commit `.env.local`, service-account JSON, Firebase Admin credentials, or payment secrets. The supplied rules use ownership checks, immutable reports, comment size limits, and image-only uploads under 8 MB. Adapt moderation access using verified admin claims.

## PayMongo

`src/services/payments.ts` defines a provider-neutral checkout interface and a disabled PayMongo-ready implementation. The UI displays Free and Pro but checkout remains explicitly unavailable. A real integration must:

1. Create a server endpoint or Cloud Function that holds the **PayMongo secret key**.
2. Have that server create the PayMongo checkout/payment resource and return only a safe checkout URL or client token.
3. Validate signed webhooks server-side, then update subscription/credit entitlements transactionally.
4. Replace the provider's `checkout` method with a call to that endpoint and set `VITE_PAYMENTS_ENABLED=true` only after it is deployed.

Never prefix a PayMongo secret with `VITE_`; Vite variables are shipped to every browser. Do not put secret keys in Firestore, client code, or Hosting configuration.

## Deployment

Run `npm test && npm run build`. Deploy `dist/` to Firebase Hosting (`firebase deploy --only hosting`), Cloudflare Pages, Netlify, or another static host. Configure all routes to serve `index.html`, set the public Firebase environment values at build time, use HTTPS, and add a Content Security Policy appropriate to chosen image hosts. The included `firebase.json` supplies an SPA rewrite.

## Product and accessibility notes

The app provides light, dark, and system modes with persistent preference, keyboard focus rings, semantic labels, responsive desktop/mobile layouts, and reduced-motion support. Remote demo screenshots use Unsplash; production uploads should use Firebase Storage and generated responsive derivatives. Report controls are functional acknowledgements in demo mode and should create restricted `reports` documents when connected.

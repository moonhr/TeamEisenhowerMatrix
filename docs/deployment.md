# Deployment Runbook

## Current State

- Frontend hosting: `Vercel`
- Data/Auth/Realtime: `Firebase`
- Current production app URL: `https://team-eisenhower-matrix.vercel.app`
- Current Vercel project: `team-eisenhower-matrix`
- Current Firebase project in use: `team-eisenhower`
- Current Firebase dev project: `team-eisenhower-dev`
- Current Firebase aliases: `.firebaserc` -> `dev`, `prod`
- Current branch rule: `main` -> production deploy
- Current env split:
  - `Production` -> `team-eisenhower`
  - `Preview` -> `team-eisenhower-dev`
  - `Development` -> `team-eisenhower-dev`

## Environment Variables

Use the keys listed in [.env.local.example](/Users/moonhyerim/TeamEisenhowerMatrix/.env.local.example).

Required keys:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

Environment mapping:

- `local`: values stored in `.env.local`
- `preview`: Vercel Preview environment variables
- `production`: Vercel Production environment variables

Current recommendation:

- `local`: use the Firebase `dev` project
- `preview`: use the Firebase `dev` project
- `production`: use production Firebase values only

Current dev Firebase values are partially available:

- Web app created: `team-eisenhower-dev-web`
- Project ID: `team-eisenhower-dev`
- Auth Domain: `team-eisenhower-dev.firebaseapp.com`
- Storage Bucket: `team-eisenhower-dev.firebasestorage.app`
- Messaging Sender ID: `712382639377`
- App ID: `1:712382639377:web:d92aacde6e63d72860f0b0`
- Realtime Database URL: `https://team-eisenhower-dev-default-rtdb.firebaseio.com`

Still needed before Preview can fully switch to the dev project:

- Add Firebase Auth authorized domains for preview/dev login flows

## Firebase Security Files

Files:

- [firestore.rules](/Users/moonhyerim/TeamEisenhowerMatrix/firestore.rules)
- [database.rules.json](/Users/moonhyerim/TeamEisenhowerMatrix/database.rules.json)
- [firebase.json](/Users/moonhyerim/TeamEisenhowerMatrix/firebase.json)
- [firestore.indexes.json](/Users/moonhyerim/TeamEisenhowerMatrix/firestore.indexes.json)

Deploy commands:

```bash
firebase deploy --only firestore --project prod
firebase deploy --only database --project prod
firebase deploy --only firestore,database --project prod

firebase deploy --only firestore --project dev
firebase deploy --only database --project dev
firebase deploy --only firestore,database --project dev
```

Notes:

- Firestore rules assume team membership lives in `teams.memberIds`
- RTDB rules assume a mirrored access path at `teamMembers/{teamId}`
- Existing production teams required a one-time `teamMembers` backfill before strict RTDB rules were deployed
- `teamMembers` backfill has been applied to production once
- Firestore rules/indexes and RTDB rules are now deployed to both `dev` and `prod`

## Firebase Project Split

Aliases:

- `firebase use dev` -> `team-eisenhower-dev`
- `firebase use prod` -> `team-eisenhower`

Recommended operational rule:

- Never deploy to `prod` without an explicit alias or `--project prod`
- Keep `default` pointed at `dev` to reduce accidental production writes

## CI/CD

GitHub Actions workflow:

- [ci.yml](/Users/moonhyerim/TeamEisenhowerMatrix/.github/workflows/ci.yml)

Pipeline:

1. `npm ci`
2. `npm run lint`
3. `npm test -- --runInBand`
4. `npm run build`

Recommended GitHub repository settings:

- Add `CI / checks` as a required status check
- Protect `main`
- Require pull request review before merge

## Vercel Git Deployment

Recommended setup:

- Production branch: `main`
- Pull requests: Preview Deploy enabled
- Vercel project linked to GitHub repository `moonhr/TeamEisenhowerMatrix`

Manual verification after Vercel config changes:

1. Push a non-breaking commit to a feature branch
2. Confirm Preview Deploy is created
3. Open the preview URL and verify build success
4. Merge into `main`
5. Confirm Production Deploy is created automatically

## Firebase Auth Authorized Domains

Add these domains in Firebase Auth:

- `localhost`
- `team-eisenhower-matrix.vercel.app`
- Any Vercel preview domains you intend to use for OAuth testing

For the dev Firebase project, also add:

- `team-eisenhower-dev.firebaseapp.com`
- Current Vercel preview domains used for PR validation

Operational note:

- Firebase Auth does not support wildcard preview domains
- If preview login is required for every PR, add each active preview domain or introduce a stable preview domain strategy

## Custom Domain Strategy

Recommended strategy:

- `app.<your-domain>` -> production app on Vercel
- `www.<your-domain>` or root domain -> marketing/landing site if needed later

Reasoning:

- Keeps the product app isolated from future marketing pages
- Makes Firebase Auth domain allowlist easier to reason about
- Reduces confusion between app sessions and public content

## Smoke Test Checklist

Run after every production deployment:

1. Home page loads
2. Google login opens and returns successfully
3. Team creation works
4. Invite link copy and join flow works
5. Task create / edit / delete works
6. DnD sidebar <-> matrix works
7. Previous week navigation works
8. Presence updates appear for multiple users
9. Cursor sharing appears for multiple users
10. Locale switch persists after refresh

## Logs and Incident Triage

Primary places to check:

- Vercel deployment logs
- Vercel function/runtime logs
- Firebase Console:
  - Authentication
  - Firestore usage/errors
  - Realtime Database usage/connections

Triage flow:

1. Confirm the deployment ID in Vercel
2. Check build logs first
3. If build passed, reproduce in the deployed app
4. Check browser console and network requests
5. Check Firebase product console for permission or quota errors

## Rollback

Recommended rollback path:

1. Open Vercel deployment history
2. Promote the last known good deployment or rollback to it
3. If the issue is caused by Firebase rules, redeploy the previous rules file immediately

Useful commands:

```bash
npx vercel rollback
npx vercel promote
firebase deploy --only firestore,database --project team-eisenhower
```

## Monitoring

Track at minimum:

- Vercel deployment failures
- Google login failure rate
- Firestore read/write errors
- RTDB connection spikes
- Firestore/RTDB quota usage
- Client-side runtime errors reported from production

## Firebase Project Strategy

Target state:

- `team-eisenhower-dev` for preview/dev
- `team-eisenhower` for production

Current state:

- Dedicated Firebase dev project created
- Dedicated Firebase prod project already in use
- Realtime Database initialized in dev
- Firestore `(default)` created in dev
- Vercel Preview / Development envs switched to dev Firebase values

Action still needed:

- Add Auth authorized domains for preview login

## App Check Decision

Current recommendation: defer App Check until after these are stable:

- Git-based Preview Deploy workflow
- Dedicated Firebase dev project
- Final production domain strategy

Reasoning:

- Current phase is still validating build/deploy/auth basics
- App Check adds operational complexity during preview and OAuth debugging
- It becomes more valuable once traffic and abuse risk increase

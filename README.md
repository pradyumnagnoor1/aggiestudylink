# AggieStudyLink

A study-partner discovery prototype for Texas A&M students. Students sign in with Google, select their courses, save study preferences, and view study-match records.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Firebase.

[Hosted app](https://aggiestudylink.vercel.app) · [Local setup](#local-setup) · [Project status](#project-status)

## Project status

The repository implements authentication, onboarding, profile editing, study preferences, and a Firestore-backed match display. The matching page subscribes to existing `matches` documents and loads the other students' profiles.

A matching producer or Python matching service is not included in this repository. Messaging, study pods, and coordinated scheduling remain planned work. The queue's searching indicator does not itself run a matching algorithm.

## Features

- Google sign-in with a client-side check for `@tamu.edu` email addresses.
- Profile setup with name, year, major, and course selection.
- Study location, availability, study style, and group-size preferences.
- Dashboard and profile editing.
- Live updates to the match display through Firestore subscriptions.
- Responsive dark interface.

## Local setup

Use a Node.js version compatible with the pinned Next.js 15 release, plus npm and a Firebase project.

```sh
git clone https://github.com/pradyumnagnoor1/aggiestudylink.git
cd aggiestudylink
npm ci
```

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

In Firebase, enable Google Authentication, create Firestore, and add localhost and your deployed hostname to Authentication's authorized domains. The Firebase configuration also initializes Realtime Database and derives its URL as `https://<project-id>-default-rtdb.firebaseio.com` from the project ID.

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Data and access

Profiles and preferences are stored in `users/{uid}`. The matching page queries `matches` where the signed-in user's UID is included in the `users` array. Displayed match records include a course, status, and creation timestamp.

The client-side email check is not a database authorization boundary. Firebase Security Rules must enforce access independently. No deployable Firebase Security Rules files are included in this repository; configure and verify those rules before using real student records.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production app |
| `npm start` | Serve a production build |
| `npx tsc --noEmit` | Check TypeScript |
| `npm run lint` | Run the repository's lint script |

No automated test script is configured.

## Repository map

```text
app/page.tsx                  Landing page
app/onboarding/               Profile and course setup
app/preferences/              Study preferences
app/dashboard/                Dashboard and profile editing
app/matching-queue/           Firestore match display
lib/firebase/config.ts        Firebase client initialization
lib/firebase/auth-context.tsx Authentication and profile context
components/ui/                Shared interface components
```

## Planned work

- Implement and evaluate a match-generation service.
- Connect profile actions and messaging.
- Add study pods and coordinated scheduling.
- Version Firebase access rules and add automated verification.

## Author and usage

Created by [Pradyumna Agnoor](https://github.com/pradyumnagnoor1). The project is described as private and proprietary; no open-source license is granted by this README.

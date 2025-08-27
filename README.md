# AggieStudyLink 🎓

A smart study matching platform exclusively for Texas A&M University students. Connect with compatible study partners based on courses, schedules, and study preferences.

**Live Demo:** [aggiestudylink.vercel.app](https://aggiestudylink.vercel.app)

## 🚀 Project Status

**Currently in Development** - Day 3 of 14-day roadmap

### Completed Features ✅
- Google OAuth authentication with TAMU email restriction (@tamu.edu only)
- User profile creation and management
- Dynamic onboarding flow with major-specific course selection
- Study preferences system (locations, times, study style)
- Matching queue interface
- Dashboard with profile editing
- Responsive UI with dark theme

### In Progress 🔨
- Python-based matching algorithm
- Real-time messaging system
- Study pod formation
- Scheduling system

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, React 19
- **Backend:** Firebase (Auth, Firestore, Realtime Database)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS, Radix UI
- **Coming Soon:** Python matching service with scikit-learn

## 📋 Features

### Authentication & Security
- Secure Google OAuth with domain restriction
- Firebase Security Rules implementation
- Protected routes for authenticated users

### User Profiles
- Major-specific course selection (Engineering, Pre-med, Sciences)
- Study preference configuration
- Availability scheduling by day/time slots
- Study location preferences (Evans Library, Zachry, MSC, etc.)

### Matching System (In Development)
- Algorithm considers:
  - Course overlap
  - Schedule compatibility
  - Study style alignment
  - Location preferences
  - Group size preferences

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pradyumnagnoor1/aggiestudylink.git
cd aggiestudylink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
aggiestudylink/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── dashboard/page.tsx       # User dashboard
│   ├── onboarding/page.tsx      # Profile setup
│   ├── preferences/page.tsx     # Study preferences
│   └── matching-queue/page.tsx  # Matching interface
├── lib/
│   └── firebase/
│       ├── config.ts            # Firebase configuration
│       └── auth-context.tsx     # Authentication context
├── components/
│   └── (various UI components)
└── public/
    └── (static assets)
```

## 🔐 Firebase Setup

1. Create a Firebase project
2. Enable Google Authentication
3. Create Firestore and Realtime databases
4. Add authorized domains:
   - localhost
   - your-app.vercel.app

## 📊 Database Schema

### Firestore Collections

**users/**
```javascript
{
  email: string,
  firstName: string,
  lastName: string,
  year: string,
  major: string,
  courses: string[],
  studyPreferences: {
    studyLocations: string[],
    studyStyle: string,
    preferredTimes: object,
    groupSize: string,
    lookingFor: string[]
  },
  profileComplete: boolean,
  createdAt: timestamp
}
```

**matches/** (Coming Soon)
```javascript
{
  users: string[],
  score: number,
  createdAt: timestamp,
  status: string
}
```

## 🗺 Roadmap

- [x] Day 1-2: Setup & Authentication
- [x] Day 3: User Profiles & Preferences
- [ ] Day 4: Swipe Interface
- [ ] Day 5: Matching System
- [ ] Day 6: Study Pods
- [ ]. Day 7: Scheduling
- [ ] Day 8-14: Enhanced Features

## 🤝 Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is private and proprietary.

## 👤 Author

**Pradyumna Agnoor**
- GitHub: [@pradyumnagnoor1](https://github.com/pradyumnagnoor1)

## 🙏 Acknowledgments

- Texas A&M University students for inspiration
- Firebase for backend infrastructure
- Vercel for hosting
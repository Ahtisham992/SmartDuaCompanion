# Smart Dua Companion - Complete Project Structure & Implementation

## 📁 Complete File Structure

```
smart-dua-companion/
│
├── 📱 mobile-app/                          # React Native App
│   ├── android/                            # Android native code
│   │   ├── app/
│   │   │   ├── src/
│   │   │   │   └── main/
│   │   │   │       ├── AndroidManifest.xml
│   │   │   │       ├── java/
│   │   │   │       └── res/
│   │   │   └── build.gradle
│   │   └── gradle/
│   │
│   ├── ios/                                # iOS native code
│   │   ├── SmartDuaCompanion/
│   │   │   ├── AppDelegate.h
│   │   │   ├── AppDelegate.m
│   │   │   ├── Info.plist
│   │   │   └── Images.xcassets/
│   │   └── Podfile
│   │
│   ├── src/
│   │   ├── assets/                         # Static assets
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   │   ├── Amiri-Regular.ttf
│   │   │   │   ├── Scheherazade-Regular.ttf
│   │   │   │   └── NotoNaskhArabic.ttf
│   │   │   └── audio/
│   │   │       └── duas/                   # Audio recitations
│   │   │
│   │   ├── components/                     # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   │
│   │   │   ├── dua/
│   │   │   │   ├── DuaCard.tsx
│   │   │   │   ├── DuaDetailView.tsx
│   │   │   │   ├── ArabicText.tsx
│   │   │   │   ├── Transliteration.tsx
│   │   │   │   ├── Translation.tsx
│   │   │   │   ├── AudioPlayer.tsx
│   │   │   │   └── FavoriteButton.tsx
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchSuggestions.tsx
│   │   │   │   └── RecentSearches.tsx
│   │   │   │
│   │   │   └── widgets/
│   │   │       ├── DuaWidget.tsx
│   │   │       └── QuickAccessWidget.tsx
│   │   │
│   │   ├── screens/                        # App screens
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── CategoryScreen.tsx
│   │   │   ├── DuaDetailScreen.tsx
│   │   │   ├── FavoritesScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   └── EmergencyDuaScreen.tsx
│   │   │
│   │   ├── navigation/                     # Navigation setup
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── TabNavigator.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── services/                       # Business logic & APIs
│   │   │   ├── api/
│   │   │   │   ├── duaService.ts
│   │   │   │   ├── authService.ts
│   │   │   │   └── analyticsService.ts
│   │   │   │
│   │   │   ├── database/
│   │   │   │   ├── DatabaseService.ts
│   │   │   │   ├── migrations/
│   │   │   │   └── schema.ts
│   │   │   │
│   │   │   ├── location/
│   │   │   │   ├── LocationService.ts
│   │   │   │   └── GeofenceService.ts
│   │   │   │
│   │   │   ├── notification/
│   │   │   │   ├── NotificationService.ts
│   │   │   │   └── SchedulerService.ts
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── IntentMatcher.ts
│   │   │   │   ├── KeywordSearch.ts
│   │   │   │   └── FuzzySearch.ts
│   │   │   │
│   │   │   └── audio/
│   │   │       └── AudioService.ts
│   │   │
│   │   ├── store/                          # State management
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   │   ├── duaSlice.ts
│   │   │   │   ├── userSlice.ts
│   │   │   │   ├── settingsSlice.ts
│   │   │   │   └── searchSlice.ts
│   │   │   └── middleware/
│   │   │       └── persistMiddleware.ts
│   │   │
│   │   ├── hooks/                          # Custom React hooks
│   │   │   ├── useDua.ts
│   │   │   ├── useSearch.ts
│   │   │   ├── useLocation.ts
│   │   │   ├── useNotification.ts
│   │   │   └── useOffline.ts
│   │   │
│   │   ├── utils/                          # Helper functions
│   │   │   ├── dateTime.ts
│   │   │   ├── formatting.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── logger.ts
│   │   │
│   │   ├── types/                          # TypeScript types
│   │   │   ├── dua.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── navigation.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── config/                         # Configuration
│   │   │   ├── firebase.config.ts
│   │   │   ├── env.config.ts
│   │   │   └── theme.config.ts
│   │   │
│   │   ├── theme/                          # Design system
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── shadows.ts
│   │   │
│   │   └── App.tsx                         # Root component
│   │
│   ├── __tests__/                          # Test files
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── screens/
│   │
│   ├── .env.example
│   ├── .env.development
│   ├── .env.production
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── package.json
│   ├── tsconfig.json
│   ├── metro.config.js
│   ├── babel.config.js
│   └── app.json
│
├── 🔥 backend/                             # Firebase/Backend
│   ├── functions/                          # Cloud Functions
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── api/
│   │   │   │   ├── duas.ts
│   │   │   │   └── users.ts
│   │   │   ├── triggers/
│   │   │   │   └── onUserCreate.ts
│   │   │   └── scheduled/
│   │   │       └── dailyReminders.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── firestore.rules                     # Security rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── firebase.json
│
├── 📊 data/                                # Initial data & seeds
│   ├── duas/
│   │   ├── daily-duas.json
│   │   ├── travel-duas.json
│   │   ├── study-duas.json
│   │   ├── anxiety-duas.json
│   │   └── sleep-duas.json
│   │
│   ├── categories/
│   │   └── categories.json
│   │
│   ├── scripts/
│   │   ├── seedDatabase.ts
│   │   ├── validateDuas.ts
│   │   └── importAudio.ts
│   │
│   └── schema/
│       └── dua-schema.json
│
├── 📖 docs/                                # Documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
│
├── 🧪 scripts/                             # Build & utility scripts
│   ├── build.sh
│   ├── release.sh
│   └── setup-env.sh
│
├── .gitignore
├── README.md
├── LICENSE
└── CHANGELOG.md
```

---

## 🚀 Implementation Phases (Detailed)

### **PHASE 0: Project Setup (Week 1)**

#### Milestone: Development Environment Ready

**Tasks:**
1. **Initialize React Native Project**
   - Set up TypeScript configuration
   - Configure ESLint & Prettier
   - Set up folder structure
   - Install core dependencies

2. **Firebase Setup**
   - Create Firebase project
   - Configure Firestore database
   - Set up Authentication
   - Configure Cloud Storage
   - Install Firebase SDK

3. **Design System Foundation**
   - Define color palette (Islamic-inspired greens, golds)
   - Typography setup (Arabic fonts)
   - Spacing & layout system
   - Component library basics

4. **Git & CI/CD**
   - Initialize repository
   - Set up branch strategy
   - Configure GitHub Actions (optional)

**Deliverables:**
- ✅ Working development environment
- ✅ Firebase connected
- ✅ Basic theme configured
- ✅ Git repository initialized

---

### **PHASE 1: Core Foundation (Weeks 2-5)**

#### Milestone: Basic Functional App with Offline Duas

**Week 2: Database & Data Layer**

**Tasks:**
1. **Dua Database Schema**
   - Design Firestore collections structure
   - Create TypeScript interfaces
   - Set up local SQLite for offline
   
2. **Initial Dua Collection**
   - Compile 50-100 essential duas
   - Verify authentic sources
   - Format Arabic, transliteration, translation
   - Organize by categories

3. **Database Service Implementation**
   - CRUD operations for duas
   - Offline sync mechanism
   - Caching strategy

**Deliverables:**
- ✅ Dua schema finalized
- ✅ 50+ duas ready with sources
- ✅ Database service working

---

**Week 3: Core UI Components**

**Tasks:**
1. **Navigation Setup**
   - Bottom tab navigation
   - Stack navigation
   - Screen routing

2. **Essential Components**
   - DuaCard component
   - ArabicText with proper fonts
   - Category cards
   - Loading states
   - Error boundaries

3. **Main Screens (Basic)**
   - HomeScreen skeleton
   - CategoryScreen
   - DuaDetailScreen

**Deliverables:**
- ✅ Navigation working
- ✅ Core components built
- ✅ Basic screens rendered

---

**Week 4: Dua Display & Categories**

**Tasks:**
1. **Category System**
   - Implement category listing
   - Category-based filtering
   - Category icons/images

2. **Dua Detail View**
   - Full dua display
   - Arabic text rendering
   - Transliteration toggle
   - Translation display
   - Source reference

3. **Favorites Feature**
   - Add/remove favorites
   - Favorites screen
   - Local storage persistence

**Deliverables:**
- ✅ Categories functional
- ✅ Dua detail view complete
- ✅ Favorites working

---

**Week 5: Search & Offline Mode**

**Tasks:**
1. **Basic Search**
   - Keyword-based search
   - Search by category
   - Search by Arabic text
   - Recent searches

2. **Offline Functionality**
   - Complete offline dua access
   - Offline indicator
   - Sync when online
   - Cache management

3. **Testing & Polish**
   - Fix bugs
   - Performance optimization
   - UI polish

**Deliverables:**
- ✅ Search working
- ✅ Full offline support
- ✅ **MVP READY FOR TESTING**

---

### **PHASE 2: Smart Features (Weeks 6-9)**

#### Milestone: Context-Aware Intelligent App

**Week 6: Intent-Based Search**

**Tasks:**
1. **Intent Matching System**
   - Build keyword-to-intent mapper
   - Natural language patterns
   - Common phrases database

2. **Enhanced Search**
   - "I'm anxious" → Anxiety duas
   - "Going to sleep" → Sleep duas
   - "Starting exam" → Exam duas

3. **Search Improvements**
   - Fuzzy matching
   - Search suggestions
   - Search analytics

**Deliverables:**
- ✅ Intent-based search working
- ✅ Natural language queries supported

---

**Week 7: Notifications & Reminders**

**Tasks:**
1. **Notification Service**
   - Push notification setup
   - Local notifications
   - Notification preferences

2. **Smart Reminders**
   - Daily dua reminders
   - Morning/evening duas
   - Customizable schedules
   - Time-based triggers

3. **Notification UI**
   - Settings for notifications
   - Frequency controls
   - Do Not Disturb mode

**Deliverables:**
- ✅ Notifications working
- ✅ Reminder system active
- ✅ User preferences saved

---

**Week 8: Location & Context Awareness**

**Tasks:**
1. **Location Services**
   - GPS permission handling
   - Movement detection
   - Location-based triggers

2. **Context Detection**
   - Travel mode detection
   - Mosque proximity (if available)
   - Activity recognition

3. **Smart Suggestions**
   - Time-based suggestions
   - Location-based suggestions
   - Calendar integration prep

**Deliverables:**
- ✅ Location services integrated
- ✅ Context-aware suggestions working

---

**Week 9: Widgets & Quick Access**

**Tasks:**
1. **Home Screen Widgets**
   - Android widget (Today's dua)
   - iOS widget
   - Widget configuration

2. **Quick Access Features**
   - Emergency dua screen
   - Quick action buttons
   - Pinned duas

3. **Testing & Refinement**
   - Widget testing
   - Performance checks
   - User feedback integration

**Deliverables:**
- ✅ Widgets functional
- ✅ Quick access ready
- ✅ **PHASE 2 COMPLETE**

---

### **PHASE 3: Audio & Enhancement (Weeks 10-12)**

#### Milestone: Rich Multimedia Experience

**Week 10: Audio Integration**

**Tasks:**
1. **Audio Player**
   - Audio playback component
   - Play/pause controls
   - Progress bar
   - Background audio

2. **Audio Content**
   - Record/source 20-30 duas
   - Audio file optimization
   - Offline audio storage

3. **Audio Features**
   - Auto-play option
   - Repeat functionality
   - Audio preferences

**Deliverables:**
- ✅ Audio player working
- ✅ Audio library available

---

**Week 11: Personalization & Analytics**

**Tasks:**
1. **User Preferences**
   - Language selection
   - Font size controls
   - Theme options (light/dark)
   - Transliteration toggle

2. **Usage Analytics**
   - Track most-used duas
   - Usage patterns
   - Personalized recommendations

3. **Profile & Settings**
   - User profile
   - Settings screen enhancement
   - Data export/import

**Deliverables:**
- ✅ Personalization complete
- ✅ Analytics tracking

---

**Week 12: Polish & Testing**

**Tasks:**
1. **Comprehensive Testing**
   - Unit tests
   - Integration tests
   - User testing sessions
   - Bug fixes

2. **Performance Optimization**
   - App size reduction
   - Loading speed
   - Memory optimization

3. **Documentation**
   - User guide
   - API documentation
   - Developer docs

**Deliverables:**
- ✅ Fully tested app
- ✅ Documentation complete
- ✅ **READY FOR BETA LAUNCH**

---

### **PHASE 4: Advanced Features (Weeks 13-16) - OPTIONAL**

#### Milestone: AI-Powered Intelligence

**Tasks:**
1. **AI Intent Detection**
   - Integrate NLP service (Google ML Kit / custom)
   - Train on Islamic context
   - Emotional intent recognition

2. **Voice Features**
   - Voice search
   - Voice-to-text duas
   - Pronunciation help

3. **Community Features**
   - Share duas
   - Community feedback
   - Dua requests

**Deliverables:**
- ✅ AI features live
- ✅ Voice capabilities
- ✅ **FULL VERSION 1.0**

---

## 📋 Key Dependencies

### Mobile App
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "@react-native-firebase/app": "^19.0.0",
    "@react-native-firebase/firestore": "^19.0.0",
    "@react-native-firebase/auth": "^19.0.0",
    "@react-native-community/geolocation": "^3.0.0",
    "react-native-push-notification": "^8.1.0",
    "react-native-track-player": "^4.0.0",
    "react-native-sqlite-storage": "^6.0.0",
    "fuse.js": "^7.0.0"
  }
}
```

---

## 🎯 Success Metrics

**Phase 1:** 
- App launches successfully
- All duas display correctly
- Offline mode works

**Phase 2:**
- 80%+ of intent searches work correctly
- Notifications delivered on time
- Widget updates properly

**Phase 3:**
- Audio plays without lag
- User retention > 40% (Week 1)

**Phase 4:**
- AI accuracy > 85%
- Voice search accuracy > 90%

---

## 🔄 Post-Launch Phases

### Phase 5: Growth & Scaling
- User feedback implementation
- Performance monitoring
- Scaling backend infrastructure
- Marketing & outreach

### Phase 6: Expansion
- Multi-language support
- Prayer times integration
- Qibla direction
- Islamic calendar

---

## ⚠️ Critical Considerations

1. **Authenticity First**: Every dua must be verified
2. **Offline Priority**: Core features must work offline
3. **Performance**: App must load in < 3 seconds
4. **Respect**: No ads during dua reading
5. **Privacy**: Minimal data collection
6. **Accessibility**: Support for screen readers

---

## 📱 Platform-Specific Notes

### iOS Considerations
- App Store guidelines for religious content
- Widget implementation (SwiftUI)
- Background location permissions

### Android Considerations
- Widget implementation (Jetpack)
- Doze mode handling
- Background service optimization

---

## 🎓 Learning Resources Needed

- React Native navigation
- Firebase Firestore
- Offline-first architecture
- React Native push notifications
- Location services
- Audio playback in React Native
- Arabic text rendering

---

This structure provides a complete, production-ready foundation for building the Smart Dua Companion app with clear milestones and deliverables.

---

# 🚀 GETTING STARTED - PHASE 0 SETUP

## Step 1: Prerequisites Installation

### Required Software:
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Install Watchman (macOS)
brew install watchman

# Install CocoaPods (iOS development)
sudo gem install cocoapods
```

### Development Tools:
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - React Native Tools
  - Prettier
  - ESLint

---

## Step 2: Project Initialization

### Create React Native Project:
```bash
# Create new React Native project with TypeScript
npx react-native@latest init SmartDuaCompanion --template react-native-template-typescript

# Navigate to project
cd SmartDuaCompanion

# Test the installation
npx react-native start
# In another terminal:
npx react-native run-android
# or
npx react-native run-ios
```

### Install Core Dependencies:
```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# State Management
npm install @reduxjs/toolkit react-redux redux-persist

# Firebase
npm install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/auth

# UI & Utilities
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage

# Development Dependencies
npm install --save-dev @types/react @types/react-native eslint prettier
```

---

## Step 3: Firebase Project Setup

### 1. Create Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name: "Smart Dua Companion"
4. Disable Google Analytics (for now)
5. Create project

### 2. Add Android App:
1. Click Android icon
2. Package name: `com.smartduacompanion`
3. Download `google-services.json`
4. Place in `android/app/`
5. Follow setup instructions

### 3. Add iOS App:
1. Click iOS icon
2. Bundle ID: `com.smartduacompanion`
3. Download `GoogleService-Info.plist`
4. Place in `ios/SmartDuaCompanion/`
5. Follow setup instructions

### 4. Enable Firestore:
1. In Firebase Console → Build → Firestore Database
2. Click "Create Database"
3. Start in **test mode** (we'll add security rules later)
4. Choose location (closest to your users)

---

## Step 4: Project Structure Setup

### Create Folder Structure:
```bash
# Create main directories
mkdir -p src/{assets,components,screens,navigation,services,store,hooks,utils,types,config,theme}

# Create subdirectories
mkdir -p src/assets/{images,fonts,audio}
mkdir -p src/components/{common,dua,search,widgets}
mkdir -p src/services/{api,database,location,notification,search,audio}
mkdir -p src/store/slices
mkdir -p src/screens
```

---

## Step 5: Configuration Files

### Create `src/config/firebase.config.ts`:
```typescript
import { FirebaseOptions } from '@react-native-firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export default firebaseConfig;
```

### Create `.env.example`:
```bash
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Create Theme Config `src/theme/colors.ts`:
```typescript
export const colors = {
  primary: {
    main: '#2D5F3F',      // Islamic green
    light: '#4A8B63',
    dark: '#1A3F2A',
  },
  secondary: {
    main: '#D4AF37',      // Gold
    light: '#F0D97D',
    dark: '#8B7500',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    subtle: '#F5F5F5',
  },
  text: {
    primary: '#2C2C2C',
    secondary: '#666666',
    arabic: '#1A1A1A',
    disabled: '#999999',
  },
  accent: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};
```

---

## Step 6: TypeScript Configuration

### Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@hooks/*": ["hooks/*"],
      "@types/*": ["types/*"],
      "@config/*": ["config/*"],
      "@theme/*": ["theme/*"]
    }
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

---

## Step 7: Git Setup

### Initialize Git:
```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

### Create `.gitignore`:
```
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build
android/app/build/
ios/build/
*.ipa
*.apk

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Firebase
google-services.json
GoogleService-Info.plist
```

---

## ✅ Phase 0 Checklist

- [ ] Node.js and npm installed
- [ ] React Native CLI working
- [ ] Android Studio / Xcode setup
- [ ] New React Native project created
- [ ] Dependencies installed
- [ ] Firebase project created
- [ ] Firebase connected to app
- [ ] Folder structure created
- [ ] Configuration files setup
- [ ] Git initialized
- [ ] App runs on emulator/device

---

## 🎯 Next Steps (Phase 1 - Week 2)

Once Phase 0 is complete, we'll move to:
1. **Design the Dua database schema**
2. **Create TypeScript interfaces**
3. **Build the database service layer**
4. **Compile initial 50 duas with sources**

**Are you ready to proceed with these setup steps?** Let me know if you encounter any issues!
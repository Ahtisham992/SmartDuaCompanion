// src/config/firebase.config.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Firebase is auto-initialized from google-services.json (Android) 
// and GoogleService-Info.plist (iOS)

const firebaseConfig = {
  firestore: firestore(),
  auth: auth(),
};

export default firebaseConfig;
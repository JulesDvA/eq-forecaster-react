import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFgcc8Iayf3QmTDAyG_Q7hq2Rz7TDs82M",
  authDomain: "eq-forecaster.firebaseapp.com",
  projectId: "eq-forecaster",
  storageBucket: "eq-forecaster.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "831102634841",
  appId: "1:831102634841:web:246c07267a42e1b15cda48"
};

// Initialize Firebase with error handling
let app;
let db;
let auth;

try {
  console.log('🔥 Initializing Firebase...');
  console.log('📋 Config:', firebaseConfig);
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // Initialize Auth (if you want authentication later)
  auth = getAuth(app);
  console.log('✅ Auth initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export { db, auth };
export default app;

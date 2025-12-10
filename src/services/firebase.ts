import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB6L1AmZc8xYv-Gad9UfcUX_0y-udxOqwY",
  authDomain: "no-crioulo.firebaseapp.com",
  projectId: "no-crioulo",
  storageBucket: "no-crioulo.firebasestorage.app",
  messagingSenderId: "989353001244",
  appId: "1:989353001244:web:512ccd75febc73fd98fad9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

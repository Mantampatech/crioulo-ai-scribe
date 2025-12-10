import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export interface UserProfile {
  email: string;
  displayName: string;
  plan: 'free' | 'premium';
  translationsUsed: number;
  translationsLimit: number;
  isContributor: boolean;
  pdfsUploaded: number;
  wordsContributed: number;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  incrementTranslation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });
    
    const newProfile: UserProfile = {
      email,
      displayName,
      plan: 'free',
      translationsUsed: 0,
      translationsLimit: 10,
      isContributor: false,
      pdfsUploaded: 0,
      wordsContributed: 0,
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
    setProfile(newProfile);
  };

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const incrementTranslation = async () => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        translationsUsed: increment(1)
      });
      
      if (profile) {
        setProfile({
          ...profile,
          translationsUsed: profile.translationsUsed + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing translation:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    logIn,
    logOut,
    incrementTranslation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

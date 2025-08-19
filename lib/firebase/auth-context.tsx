'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  userProfile: UserProfile | null;
}

interface UserProfile {
  email: string;
  firstName: string;
  lastName?: string;
  year?: string;
  major?: string;
  courses?: string[];
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  isActive: boolean;
  profileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Verify it's a TAMU email
      if (!result.user.email?.endsWith('@tamu.edu')) {
        await firebaseSignOut(auth);
        toast.error('Only TAMU email addresses (@tamu.edu) are allowed');
        return;
      }

      // Check if user profile exists
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user profile
        const newUserProfile = {
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ')[1]?.[0] || '', // Just initial
          createdAt: serverTimestamp(),
          isActive: true,
          profileComplete: false
        };

        await setDoc(userDocRef, newUserProfile);
        setUserProfile(newUserProfile);
        
        toast.success('Welcome to AggieStudyLink! Please complete your profile.');
        router.push('/onboarding');
      } else {
        // Load existing profile
        const existingProfile = userDoc.data() as UserProfile;
        setUserProfile(existingProfile);
        
        if (!existingProfile.profileComplete) {
          toast('Please complete your profile to start matching!', {
            icon: '📝'
          });
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error instanceof Error) {
        if ((error as any).code === 'auth/popup-closed-by-user') {
          toast.error('Sign in cancelled');
        } else {
          toast.error('Failed to sign in. Please try again.');
        }
      }
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Verify TAMU email
        if (!user.email?.endsWith('@tamu.edu')) {
          await firebaseSignOut(auth);
          setUser(null);
          setUserProfile(null);
          toast.error('Only TAMU email addresses are allowed');
          setLoading(false);
          return;
        }

        // Load user profile
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
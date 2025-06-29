import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
// Importe as funções 'serverTimestamp' e 'Timestamp'
import { doc, onSnapshot, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export type UserType = 'candidate' | 'employer';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  profileComplete: boolean;
  createdAt: Timestamp; // Alterado para Timestamp
  updatedAt: Timestamp; // Alterado para Timestamp
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userType: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType: UserType) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      setUser(firebaseUser);
      
      // Clean up previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      
      if (firebaseUser) {
        try {
          // Force refresh of ID token to ensure Firestore recognizes the authenticated user
          await firebaseUser.getIdToken(true);
          
          // Use onSnapshot instead of getDoc to handle race conditions
          unsubscribeProfile = onSnapshot(
            doc(db, 'users', firebaseUser.uid),
            (userDoc) => {
              console.log('User document snapshot:', userDoc.exists(), userDoc.data());
              if (userDoc.exists()) {
                // O tipo de 'createdAt' e 'updatedAt' vindo do Firestore é Timestamp
                const userData = userDoc.data() as UserProfile;
                console.log('Setting user profile:', userData);
                setUserProfile(userData);
                setUserType(userData.userType);
              } else {
                // Document doesn't exist yet, reset profile state
                console.log('User document does not exist');
                setUserProfile(null);
                setUserType(null);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Error listening to user profile:', error);
              setUserProfile(null);
              setUserType(null);
              setLoading(false);
            }
          );
        } catch (error) {
          console.error('Error setting up user profile listener:', error);
          setUserProfile(null);
          setUserType(null);
          setLoading(false);
        }
      } else {
        console.log('No user, resetting state');
        setUserProfile(null);
        setUserType(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user.uid);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: UserType) => {
    try {
      console.log('Attempting to sign up with:', email, userType);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful, creating profile for:', firebaseUser.uid);
      
      // Use serverTimestamp() para as datas
      const newUserProfile = {
        id: firebaseUser.uid,
        name,
        email,
        userType,
        profileComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);
      console.log('User profile created successfully');
      
      // Para o estado local, criamos um objeto com o Timestamp atual
      const userProfileForState: UserProfile = {
        ...newUserProfile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      setUserProfile(userProfileForState);
      setUserType(userType);
    } catch (error) {
      console.error("Erro detalhado no signUp:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfileData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), updatedProfileData, { merge: true });
      
      const userProfileForState: UserProfile = {
          ...userProfile,
          ...data,
          updatedAt: Timestamp.now(),
      };
      setUserProfile(userProfileForState);

    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    userType,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
  };

  console.log('Auth context state:', { 
    hasUser: !!user, 
    hasProfile: !!userProfile, 
    userType, 
    loading 
  });

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
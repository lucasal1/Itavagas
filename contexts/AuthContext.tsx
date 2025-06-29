import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: 'candidate' | 'employer';
  phone?: string;
  location?: string;
  profileComplete: boolean;
  profilePicture?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userType: 'candidate' | 'employer' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, userType: 'candidate' | 'employer') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  userType: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'candidate' | 'employer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      unsubscribeSnapshot();
      
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const docRef = doc(db, "users", currentUser.uid);
          unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              const profile: UserProfile = {
                id: currentUser.uid,
                name: data.name || '',
                email: data.email || currentUser.email || '',
                userType: data.userType,
                phone: data.phone || '',
                location: data.location || '',
                profileComplete: data.profileComplete || false,
                profilePicture: data.profilePicture || '',
                resumeUrl: data.resumeUrl || '',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              };
              
              setUserProfile(profile);
              setUserType(profile.userType);
            } else {
              setUserProfile(null);
              setUserType(null);
            }
            setLoading(false);
          }, (error) => {
            console.error('❌ Error listening to user document:', error);
            setLoading(false);
          });
        } catch (error) {
          console.error('❌ Error setting up user listener:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setUserType(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string, type: 'candidate' | 'employer') => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      const profileData = {
        name,
        email: user.email,
        userType: type,
        phone: '',
        location: 'Sertão de Itaparica, BA',
        profileComplete: false,
        profilePicture: '',
        resumeUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), profileData);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const docRef = doc(db, "users", user.uid);
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
  }, [user]);

  const value = { 
    user, 
    userProfile, 
    userType, 
    loading, 
    signIn, 
    signUp, 
    logout, 
    updateProfile 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
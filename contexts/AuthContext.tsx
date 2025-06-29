import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: 'candidate' | 'employer';
  phone?: string;
  location?: string;
  profileComplete: boolean;
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
    console.log('🔄 AuthProvider: Setting up auth state listener');
    let unsubscribeSnapshot: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔄 Auth state changed:', { hasUser: !!currentUser, userId: currentUser?.uid });
      
      // Clean up previous snapshot listener
      unsubscribeSnapshot();
      
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Set up real-time listener for user profile
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
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              };
              
              console.log('✅ User profile loaded:', profile);
              setUserProfile(profile);
              setUserType(profile.userType);
            } else {
              console.log('⚠️ User document does not exist');
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
        console.log('🚪 User logged out');
        setUser(null);
        setUserProfile(null);
        setUserType(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listeners');
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting sign in process');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Sign in successful');
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, type: 'candidate' | 'employer') => {
    console.log('📝 Starting sign up process');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      console.log('✅ User created in auth, creating profile document');
      
      const profileData = {
        name,
        email: user.email,
        userType: type,
        phone: '',
        location: 'Sertão de Itaparica, BA',
        profileComplete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), profileData);
      console.log('✅ User profile document created');
    } catch (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out');
    setLoading(true);
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    console.log('📝 Updating user profile');
    try {
      const docRef = doc(db, "users", user.uid);
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };
      
      await updateDoc(docRef, updateData);
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update error:', error);
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
    updateProfile 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
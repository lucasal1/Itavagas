import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Verifique se o caminho para o seu config do firebase está correto

interface AuthContextType {
  user: User | null;
  userType: 'candidate' | 'employer' | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, userType: 'candidate' | 'employer') => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'candidate' | 'employer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      unsubscribeSnapshot();
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setUserType(doc.data().userType);
          } else {
            // Este log é o que vimos. É normal durante o primeiro instante após o registo.
            console.log("A aguardar a criação do documento do utilizador...");
            setUserType(null);
          }
          setLoading(false);
        }, (error) => {
            console.error("Erro ao ouvir o documento do utilizador:", error);
            setLoading(false);
        });
      } else {
        setUser(null);
        setUserType(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // --- FUNÇÃO CRÍTICA CORRIGIDA ---
  const signUp = async (email: string, pass: string, type: 'candidate' | 'employer') => {
    try {
      // 1. Cria o utilizador no serviço de Autenticação do Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const { user } = userCredential;
      
      console.log(`Utilizador criado na autenticação: ${user.uid}. A criar documento no Firestore...`);

      // 2. CRIA O DOCUMENTO na coleção 'users' do Firestore com o mesmo UID.
      //    Esta é a parte que estava a falhar.
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userType: type,
        createdAt: new Date(), // Boa prática para saber quando foi criado
      });

      console.log(`Documento do utilizador criado com sucesso no Firestore.`);

    } catch (error) {
      console.error("Erro durante o processo de registo:", error);
      // Lançar o erro novamente para que a UI possa mostrá-lo ao utilizador
      throw error;
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const value = { user, userType, loading, signIn, signUp, logOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
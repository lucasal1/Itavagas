// Importa as funções necessárias dos SDKs do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Suas credenciais do Firebase que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyDl2SbmqvcNP3ha8SwDyKiATbYWxK_GTx4",
  authDomain: "itavagas-9c0f5.firebaseapp.com",
  projectId: "itavagas-9c0f5",
  storageBucket: "itavagas-9c0f5.appspot.com", // CORRIGIDO: O formato correto geralmente é .appspot.com
  messagingSenderId: "427095304175",
  appId: "1:427095304175:web:6e9fbf2eccfaa7e067781a",
  measurementId: "G-XS617QBKYE"
};

// Inicializa o Firebase com as suas credenciais
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que o aplicativo precisa (Auth, Firestore, Storage)
// e os exporta para serem usados em outras partes do código.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

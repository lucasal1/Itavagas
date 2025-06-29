import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDl2SbmqvcNP3ha8SwDyKiATbYWxK_GTx4",
  authDomain: "itavagas-9c0f5.firebaseapp.com",
  projectId: "itavagas-9c0f5",
  storageBucket: "itavagas-9c0f5.firebasestorage.app",
  messagingSenderId: "427095304175",
  appId: "1:427095304175:web:6e9fbf2eccfaa7e067781a",
  measurementId: "G-XS617QBKYE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
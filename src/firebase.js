import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,  
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCkUHJu5E6XRYjWgSGCmgaEzQJwFSrxIzE",
  authDomain: "corrector-ai-d8339.firebaseapp.com",
  projectId: "corrector-ai-d8339",
  storageBucket: "corrector-ai-d8339.firebasestorage.app",
  messagingSenderId: "953107677366",
  appId: "1:953107677366:web:165939cdfa0debda692617"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");


const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider(); 

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);


export const loginWithGithub = () => signInWithPopup(auth, githubProvider);

export const loginWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  loginWithGoogle,
  loginWithGithub,          // ✅ AJOUT
  loginWithEmailPassword,
} from "../firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

const ADMIN_EMAILS = ["admin@admin.com"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);

      if (u) {
        setRole(ADMIN_EMAILS.includes(u.email) ? "admin" : "teacher");
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const loginGoogle = () => loginWithGoogle();

  // ✅ AJOUT: GitHub
  const loginGithub = () => loginWithGithub();

  const loginEmailPwd = (email, password) =>
    loginWithEmailPassword(email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginGoogle,
        loginGithub,          // ✅ AJOUT
        loginEmailPwd,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

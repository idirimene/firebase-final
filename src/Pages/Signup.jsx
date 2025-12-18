import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmailPassword, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { user, loginGoogle, loginGithub } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/teacher", { replace: true });
  }, [user, navigate]);

  const ensureUserDoc = async (u) => {
    if (!u) return;
    await setDoc(
      doc(db, "users", u.uid),
      {
        uid: u.uid,
        email: u.email || "",
        displayName: u.displayName || "",
        photoURL: u.photoURL || "",
        providerId: u.providerData?.[0]?.providerId || "password",
        role: "étudiant",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleSignup = async () => {
    setError("");

    if (!email || !password || !confirmPassword) {
      return setError("Veuillez remplir tous les champs.");
    }
    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (password.length < 6) {
      return setError("Le mot de passe doit contenir au moins 6 caractères.");
    }

    setLoading(true);
    try {
      const userCredential = await registerWithEmailPassword(email, password);
      const newUser = userCredential.user;
      await ensureUserDoc(newUser);
      navigate("/teacher");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe est trop faible.");
      } else {
        setError("Une erreur est survenue : " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await loginGoogle();
      await ensureUserDoc(cred?.user);
      navigate("/teacher");
    } catch (err) {
      setError("Erreur d'inscription Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await loginGithub();
      await ensureUserDoc(cred?.user);
      navigate("/teacher");
    } catch (err) {
      setError("Erreur d'inscription GitHub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <header className="auth-header">
        <div className="auth-logo">CorrectorAI</div>
      </header>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">Créer un compte</h1>

          {error && <div className="auth-error">{error}</div>}

          <label className="auth-label">Adresse courriel</label>
          <input
            className="auth-input"
            placeholder="ton@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label">Mot de passe</label>
          <input
            className="auth-input"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="auth-label">Confirmer le mot de passe</label>
          <input
            className="auth-input"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="btn-primary"
            onClick={handleSignup}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>ou</span>
            <div className="auth-divider-line" />
          </div>

          <button className="btn-social" onClick={handleGoogleSignup} disabled={loading}>
            Continuer avec Google
          </button>

          <button className="btn-social" onClick={handleGithubSignup} disabled={loading}>
            Continuer avec GitHub
          </button>

          <button className="btn-secondary" onClick={() => navigate("/login")}>
            Déjà un compte? Se connecter
          </button>

          <div className="auth-footer">
            Ton compte est sécurisé avec Firebase Auth
          </div>
        </div>
      </div>
    </div>
  );
}
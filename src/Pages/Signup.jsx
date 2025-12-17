import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmailPassword, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const THEME = {
  bg1: "#071A2B",
  bg2: "#0D2B4B",
  card: "rgba(7, 22, 38, 0.92)",
  border: "#1B3D5C",
  text: "#EAF2FA",
  muted: "#B7C8D8",
  accent1: "#1E6FB8",
  accent2: "#124A7A",
  danger: "#FF6B6B",
};

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = useMemo(
    () => ({
      wrapper: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(to bottom, ${THEME.bg1}, ${THEME.bg2})`,
        color: THEME.text,
        fontFamily: "sans-serif",
      },
      header: {
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: 0.2,
      },
      centerZone: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      },
      card: {
        width: "100%",
        maxWidth: 480,
        background: THEME.card,
        border: `1px solid ${THEME.border}`,
        borderRadius: 18,
        padding: "32px 36px 28px",
        boxShadow: "0 22px 55px rgba(0,0,0,0.45)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(6px)",
      },
      title: {
        textAlign: "center",
        fontSize: 28,
        fontWeight: 900,
        margin: "0 0 16px",
      },
      error: {
        backgroundColor: "rgba(255, 107, 107, 0.12)",
        border: `1px solid ${THEME.danger}`,
        color: THEME.danger,
        padding: 10,
        borderRadius: 10,
        marginBottom: 14,
        fontSize: 13,
        textAlign: "center",
        whiteSpace: "pre-wrap",
      },
      label: { display: "block", fontSize: 14, marginBottom: 6, fontWeight: 700 },
      input: {
        width: "100%",
        borderRadius: 10,
        border: `1px solid ${THEME.border}`,
        backgroundColor: "rgba(255,255,255,0.06)",
        padding: "12px 14px",
        fontSize: 14,
        color: THEME.text,
        marginBottom: 16,
        outline: "none",
        boxSizing: "border-box",
      },
      primaryBtn: {
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 900,
        background: `linear-gradient(to right, ${THEME.accent1}, ${THEME.accent2})`,
        color: THEME.text,
        cursor: "pointer",
        marginTop: 8,
      },
      linkBtn: {
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 900,
        cursor: "pointer",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: THEME.text,
        marginTop: 14,
      },
      footer: { marginTop: 16, textAlign: "center", fontSize: 12, color: THEME.muted },
    }),
    []
  );

  useEffect(() => {
    if (user) navigate("/teacher", { replace: true });
  }, [user, navigate]);

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

      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        role: "teacher",
        createdAt: new Date(),
      });

      navigate("/teacher");
    } catch (err) {
      console.error(err);
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

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>PlanValidator</header>

      <div style={styles.centerZone}>
        <div style={styles.card}>
          <h1 style={styles.title}>Créer un compte</h1>

          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Courriel</label>
          <input
            style={styles.input}
            placeholder="votre@courriel.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Mot de passe</label>
          <input
            style={styles.input}
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label style={styles.label}>Confirmer</label>
          <input
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>

          <button style={styles.linkBtn} onClick={() => navigate("/login")}>
            Retour à la connexion
          </button>

          <div style={styles.footer}>
            Ton compte est créé avec le rôle <strong>teacher</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

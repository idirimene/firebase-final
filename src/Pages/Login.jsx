import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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

export default function Login() {
  const { loginGoogle, loginGithub, loginEmailPwd, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
        letterSpacing: 0.3,
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
        maxWidth: 520,
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
        margin: "0 0 8px 0",
      },
      subtitle: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 18,
        color: THEME.muted,
        lineHeight: 1.5,
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
      },
      label: {
        display: "block",
        fontSize: 14,
        marginBottom: 6,
        fontWeight: 700,
        textAlign: "left",
      },
      input: {
        width: "100%",
        borderRadius: 10,
        border: `1px solid ${THEME.border}`,
        backgroundColor: "rgba(255,255,255,0.06)",
        padding: "12px 14px",
        fontSize: 14,
        color: THEME.text,
        marginBottom: 16,
        boxSizing: "border-box",
        outline: "none",
      },
      primaryBtn: {
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        marginTop: 6,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 900,
        background: `linear-gradient(to right, ${THEME.accent1}, ${THEME.accent2})`,
        color: THEME.text,
        cursor: "pointer",
      },
      socialBtn: {
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        marginTop: 12,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 900,
        cursor: "pointer",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: THEME.text,
        boxSizing: "border-box",
      },
      divider: {
        display: "flex",
        alignItems: "center",
        margin: "18px 0 10px 0",
        color: THEME.muted,
        fontSize: 12,
        width: "100%",
      },
      line: { flex: 1, height: 1, backgroundColor: THEME.border },
      signupBtn: {
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        marginTop: 10,
        padding: "12px 16px",
        fontSize: 14,
        fontWeight: 900,
        cursor: "pointer",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: THEME.text,
        boxSizing: "border-box",
      },
      footerText: {
        marginTop: 18,
        textAlign: "center",
        fontSize: 12,
        color: THEME.muted,
        lineHeight: 1.45,
      },
    }),
    []
  );

  // redirect simple (plus de rôle admin)
  useEffect(() => {
    if (user) navigate("/teacher", { replace: true });
  }, [user, navigate]);

  const handleGoogle = async () => {
    setError("");
    try {
      await loginGoogle();
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion Google.");
    }
  };

  const handleGithub = async () => {
    setError("");
    try {
      await loginGithub();
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion GitHub.");
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    try {
      await loginEmailPwd(email, password);
    } catch (err) {
      console.error(err);
      setError("Échec de connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>PlanValidator</header>

      <div style={styles.centerZone}>
        <div style={styles.card}>
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Connecte-toi pour accéder à ton espace.</p>

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

          <button style={styles.primaryBtn} onClick={handleEmailLogin}>
            Se connecter
          </button>

          <button style={styles.socialBtn} onClick={handleGoogle}>
            Continuer avec Google
          </button>

          <button style={styles.socialBtn} onClick={handleGithub}>
            Continuer avec GitHub
          </button>

          <div style={styles.divider}>
            <div style={styles.line} />
            <span style={{ padding: "0 10px" }}>ou</span>
            <div style={styles.line} />
          </div>

          <button style={styles.signupBtn} onClick={() => navigate("/signup")}>
            Créer un compte
          </button>

          <p style={styles.footerText}>
            Chaque utilisateur voit uniquement ses propres informations.
          </p>
        </div>
      </div>
    </div>
  );
}

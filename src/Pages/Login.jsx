import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const { loginGoogle, loginGithub, loginEmailPwd, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

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
      setError("Erreur de connexion Github.");
    }
  };


  //rrr
  const handleEmailLogin = async () => {
    setError("");

    if (!captchaToken) {
      setError("Veuillez confirmer que vous n'êtes pas un robot.");
      return;
    }

    try {
      const url =
        import.meta.env.VITE_RECAPTCHA_VERIFY_URL ||
        "https://us-central1-examenappweb2.cloudfunctions.net/verifyRecaptcha";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });

      const data = await res.json();

      if (!data?.success) {
        setError("reCAPTCHA invalide. Réessaie.");
        return;
      }

      await loginEmailPwd(email, password);
      setCaptchaToken(null);
    } catch (err) {
      console.error(err);
      setError("Échec de connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="auth-wrapper">
      <header className="auth-header">
        <div className="auth-logo">CorrectorAI</div>
      </header>

      <div className="auth-center">
        <div className="auth-card">
          <h1 className="auth-title">Bienvenue</h1>
          <p className="auth-subtitle">
            Connecte-toi pour accéder à ton espace de validation
          </p>

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

          <div className="captcha-wrapper">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
              theme="dark"
            />
          </div>

          <button className="btn-primary" onClick={handleEmailLogin}>
            Se connecter
          </button>

          <button className="btn-social" onClick={handleGoogle}>
            Continuer avec Google
          </button>

          <button className="btn-social" onClick={handleGithub}>
            Continuer avec GitHub
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>ou</span>
            <div className="auth-divider-line" />
          </div>

          <button className="btn-secondary" onClick={() => navigate("/signup")}>
            Créer un nouveau compte
          </button>

          <p className="auth-footer">
            Tes données sont sécurisées et privées
          </p>
        </div>
      </div>
    </div>
  );
}
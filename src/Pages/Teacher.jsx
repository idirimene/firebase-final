import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { analyzeResponse } from "../openai";

const RULE_TEXT = `
Tu es un correcteur de français (Québec ok). Analyse le texte de l'utilisateur.

Réponds en format CLAIR, structuré et court, avec ces sections EXACTES:

A) Verdict (Oui/Non)
- "Il y a des fautes: Oui/Non"

B) Où sont les fautes (3 à 8 max)
Pour chaque faute, affiche:
- Extrait: "...mot/phrase..."
- Erreur: (orthographe / grammaire / accord / conjugaison / ponctuation / style)
- Correction: "..."
- Explication courte: 1 phrase max

C) Texte corrigé (version complète)
- Redonne le texte COMPLET corrigé (pas juste une phrase)

D) Astuces (2 à 4 max)
- Conseils concrets et simples pour éviter ces erreurs

Règles:
- Ne dépasse pas 8 fautes listées.
- Si le texte est déjà correct, section B = "Aucune faute majeure."
- Garde un ton professionnel, pas de blabla.
`;

function toPrettyText(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw?.text === "string") return raw.text;
  if (typeof raw?.result === "string") return raw.result;
  if (typeof raw?.suggestion === "string") return raw.suggestion;

  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return String(raw);
  }
}

export default function Teacher() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState("checker");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  //handle analyze

  return (
    <div className="teacher-wrapper">
      <div className="teacher-sidebar">
        <div className="teacher-logo">CorrectorAI</div>

        <div className="teacher-user-card">
          <div className="teacher-user-name">{user?.displayName || "Utilisateur"}</div>
          <div className="teacher-user-email">{user?.email}</div>
        </div>

        <button
          className={`nav-btn ${view === "checker" ? "nav-btn-active" : ""}`}
          onClick={() => setView("checker")}
        >
          Vérification
        </button>

        <button
          className="btn-logout"
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
        >
          Déconnexion
        </button>
      </div>

      <div className="teacher-main">
        <h1 className="page-title">Validation de texte avec IA</h1>

        <div className="content-grid">
          <div className="content-card">
            <h3 className="card-title">Ton texte</h3>
            <p className="card-subtitle">
              Colle ton texte ici. L'IA va détecter les erreurs et proposer des corrections.
            </p>

            <textarea
              className="content-textarea"
              placeholder="Écris ou colle ton texte ici..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Analyse en cours..." : "Analyser avec l'IA"}
            </button>
          </div>

          <div className="content-card">
            <h3 className="card-title">Résultat</h3>
            <p className="card-subtitle">Les corrections et suggestions apparaissent ici.</p>

            <div className="result-box">
              {result || "Aucun résultat pour l'instant. Lance une analyse!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AggiornaPassword() {
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [recuperoValido, setRecuperoValido] = useState(false);
  const [verificaInCorso, setVerificaInCorso] = useState(true);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState("");
  const [messaggio, setMessaggio] = useState("");

  useEffect(() => {
    async function verificaSessione() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setRecuperoValido(true);
      }

      setVerificaInCorso(false);
    }

    verificaSessione();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, sessione) => {
      if (evento === "PASSWORD_RECOVERY" || sessione) {
        setRecuperoValido(true);
        setVerificaInCorso(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function aggiornaPassword(event) {
    event.preventDefault();

    setErrore("");
    setMessaggio("");

    if (password.length < 8) {
      setErrore("La password deve contenere almeno 8 caratteri.");
      return;
    }

    if (password !== confermaPassword) {
      setErrore("Le due password non coincidono.");
      return;
    }

    setCaricamento(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setCaricamento(false);

    if (error) {
      setErrore(error.message);
      return;
    }

    setMessaggio(
      "Password aggiornata correttamente. Ora puoi accedere con la nuova password."
    );

    setPassword("");
    setConfermaPassword("");

    await supabase.auth.signOut();
  }

  if (verificaInCorso) {
    return (
      <section className="login-page">
        <div className="login-card">
          <p>Verifica del collegamento in corso...</p>
        </div>
      </section>
    );
  }

  if (!recuperoValido) {
    return (
      <section className="login-page">
        <div className="login-card">
          <p className="page-kicker">Recupero password</p>
          <h2>Collegamento non valido</h2>

          <p>
            Il collegamento è scaduto oppure non è stato riconosciuto.
            Richiedi una nuova email di recupero.
          </p>

          <Link className="button button-primary" to="/recupera-password">
            Richiedi un nuovo link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="page-kicker">Recupero password</p>
        <h2>Scegli una nuova password</h2>

        <form className="login-form" onSubmit={aggiornaPassword}>
          <label htmlFor="nuova-password">Nuova password</label>
          <input
            id="nuova-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength="8"
            required
          />

          <label htmlFor="conferma-password">
            Conferma nuova password
          </label>
          <input
            id="conferma-password"
            type="password"
            value={confermaPassword}
            onChange={(event) =>
              setConfermaPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength="8"
            required
          />

          {errore && <p className="form-error">{errore}</p>}

          {messaggio && (
            <p className="form-message form-message-success">
              {messaggio}
            </p>
          )}

          <button
            className="button button-primary"
            type="submit"
            disabled={caricamento}
          >
            {caricamento
              ? "Aggiornamento in corso..."
              : "Salva nuova password"}
          </button>

          {messaggio && (
            <p className="login-help">
              <Link to="/login-staff">Torna al login</Link>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default AggiornaPassword;
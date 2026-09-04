import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ImpostaPassword() {
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [mostraPassword, setMostraPassword] = useState(false);
  const [sessioneValida, setSessioneValida] = useState(false);
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
        setSessioneValida(true);
      }

      setVerificaInCorso(false);
    }

    verificaSessione();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, sessione) => {
      if (sessione) {
        setSessioneValida(true);
        setVerificaInCorso(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function impostaPassword(event) {
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
      setErrore(
        "Non è stato possibile impostare la password. Riprova."
      );
      return;
    }

    setPassword("");
    setConfermaPassword("");

    await supabase.auth.signOut();

    setMessaggio(
      "Password impostata correttamente. Ora puoi accedere all'Area Staff."
    );
  }

  if (verificaInCorso) {
    return (
      <section className="login-page">
        <div className="login-card">
          <p>Verifica dell'invito in corso...</p>
        </div>
      </section>
    );
  }

  if (!sessioneValida && !messaggio) {
    return (
      <section className="login-page">
        <div className="login-card">
          <p className="page-kicker">Primo accesso Staff</p>
          <h2>Invito non valido</h2>

          <p>
            L'invito è scaduto oppure non è stato riconosciuto.
            Contatta un responsabile per ricevere un nuovo invito.
          </p>

          <Link className="button button-primary" to="/login-staff">
            Torna al login
          </Link>
        </div>
      </section>
    );
  }

  if (messaggio) {
    return (
      <section className="login-page">
        <div className="login-card">
          <p className="page-kicker">Primo accesso Staff</p>
          <h2>Account attivato</h2>

          <p className="form-message form-message-success">
            {messaggio}
          </p>

          <p className="login-help">
            <Link className="button button-primary" to="/login-staff">
              Vai al login
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="page-kicker">Primo accesso Staff</p>
        <h2>Imposta la tua password</h2>

        <p>
          Scegli una password di almeno 8 caratteri per completare
          l'attivazione del tuo account.
        </p>

        <form className="login-form" onSubmit={impostaPassword}>
          <label htmlFor="nuova-password">
            Nuova password
          </label>

          <input
            id="nuova-password"
            type={mostraPassword ? "text" : "password"}
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
            type={mostraPassword ? "text" : "password"}
            value={confermaPassword}
            onChange={(event) =>
              setConfermaPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength="8"
            required
          />

          <label className="show-password">
            <input
              type="checkbox"
              checked={mostraPassword}
              onChange={(event) =>
                setMostraPassword(event.target.checked)
              }
            />
            Mostra password
          </label>

          {errore && <p className="form-error">{errore}</p>}

          <button
            className="button button-primary"
            type="submit"
            disabled={caricamento}
          >
            {caricamento
              ? "Attivazione in corso..."
              : "Imposta password"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ImpostaPassword;
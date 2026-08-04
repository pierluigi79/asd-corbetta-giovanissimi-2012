import { useState } from "react";
import { supabase } from "../lib/supabase";

function RecuperaPassword() {
  const [email, setEmail] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  async function recuperaPassword(event) {
    event.preventDefault();

    setMessaggio("");
    setErrore("");
    setCaricamento(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/aggiorna-password`,
    });

    setCaricamento(false);

  if (error) {
  if (error.message.includes("rate limit")) {
    setErrore(
      "Sono state richieste troppe email in poco tempo. Attendi qualche minuto e riprova."
    );
  } else {
    setErrore(
      "Non è stato possibile inviare l'email di recupero. Riprova più tardi."
    );
  }

  return;
}

    setMessaggio(
      "Ti abbiamo inviato un'email con le istruzioni per reimpostare la password."
    );
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="page-kicker">Recupero password</p>
        <h2>Password dimenticata?</h2>

        <p>
          Inserisci l'indirizzo email associato al tuo account. Riceverai un
          link per impostare una nuova password.
        </p>

        <form className="login-form" onSubmit={recuperaPassword}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              ? "Invio in corso..."
              : "Invia email di recupero"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RecuperaPassword;
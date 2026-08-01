import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function LoginStaff() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  const navigate = useNavigate();

  async function gestisciAccesso(event) {
    event.preventDefault();

    setErrore("");
    setCaricamento(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCaricamento(false);

    if (error) {
      setErrore("Email o password non corrette.");
      return;
    }

    navigate("/staff");
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="page-kicker">Area riservata</p>
        <h2>Accesso Staff</h2>

        <form className="login-form" onSubmit={gestisciAccesso}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {errore && <p className="form-error">{errore}</p>}

          <button className="button button-primary" type="submit">
            {caricamento ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginStaff;
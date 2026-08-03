import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Staff() {
  const navigate = useNavigate();

  async function esci() {
    await supabase.auth.signOut();
    navigate("/login-staff");
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area riservata</p>
        <h2>Area Staff</h2>
        <p>Gestisci avvisi, convocazioni e rosa della squadra.</p>
      </div>

      <div className="staff-toolbar">
        <button
          type="button"
          className="button button-secondary"
          onClick={esci}
        >
          Esci
        </button>
      </div>

      <div className="home-cards">
        <Link to="/staff/convocazioni" className="home-card">
          <h3>⚽ Gestione Convocazioni</h3>
          <p>Crea e aggiorna le convocazioni delle partite.</p>
        </Link>

        <Link to="/staff/avvisi" className="home-card">
          <h3>📢 Gestione Avvisi</h3>
          <p>Pubblica e modifica gli avvisi destinati alle famiglie.</p>
        </Link>

<Link to="/staff/rosa" className="home-card">
  <h3>👥 Rosa Squadra</h3>
  <p>Consulta giocatori e componenti dello staff.</p>
</Link>
      </div>
    </section>
  );
}

export default Staff;
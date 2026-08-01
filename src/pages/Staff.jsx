import { Link } from "react-router-dom";
function Staff() {
  return (
    <section>
      <div className="home-cards">
  <Link to="/staff/avvisi" className="home-card">
    <h3>📢 Gestione Avvisi</h3>
    <p>Pubblica e modifica gli avvisi destinati alle famiglie.</p>
  </Link>

<Link to="/staff/convocazioni" className="home-card">
  <h3>⚽ Gestione Convocazioni</h3>
  <p>Crea e aggiorna le convocazioni delle partite.</p>
</Link>

  <article className="home-card">
    <h3>👥 Rosa Squadra</h3>
    <p>Gestisci i giocatori della rosa e i loro dati.</p>
  </article>
</div>
    </section>
  );
}

export default Staff;
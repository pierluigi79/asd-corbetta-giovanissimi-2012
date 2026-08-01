function Staff() {
  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area riservata</p>
        <h2>Area Staff</h2>
        <p>
          Benvenuto nell'area di gestione del portale della squadra.
        </p>
      </div>

      <div className="home-cards">
        <article className="home-card">
          <h3>📢 Gestione Avvisi</h3>
          <p>Pubblica e modifica gli avvisi destinati alle famiglie.</p>
        </article>

        <article className="home-card">
          <h3>📅 Gestione Convocazioni</h3>
          <p>Crea e aggiorna le convocazioni delle partite.</p>
        </article>

        <article className="home-card">
          <h3>👥 Rosa Squadra</h3>
          <p>Gestisci i giocatori della rosa e i loro dati.</p>
        </article>
      </div>
    </section>
  );
}

export default Staff;
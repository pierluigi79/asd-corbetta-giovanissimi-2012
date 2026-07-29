function Convocazioni() {
  return (
    <section>
      <h2>Convocazioni</h2>

      <article className="convocazione-card">
        <div className="convocazione-header">
          <div>
            <p className="convocazione-label">Prossima partita</p>
            <h3>ASD Calcio Corbetta - Avversario</h3>
          </div>

          <span className="convocazione-badge">Campionato</span>
        </div>

        <div className="convocazione-details">
          <p><strong>Data:</strong> Domenica 15 settembre</p>
          <p><strong>Ritrovo:</strong> Ore 09:00</p>
          <p><strong>Inizio:</strong> Ore 10:30</p>
          <p><strong>Campo:</strong> Centro Sportivo Corbetta</p>
        </div>

        <div className="convocati-section">
          <h3>Convocati</h3>

          <div className="convocati-grid">
            <span>Giocatore 1</span>
            <span>Giocatore 2</span>
            <span>Giocatore 3</span>
            <span>Giocatore 4</span>
            <span>Giocatore 5</span>
            <span>Giocatore 6</span>
            <span>Giocatore 7</span>
            <span>Giocatore 8</span>
            <span>Giocatore 9</span>
          </div>
        </div>

        <div className="convocazione-note">
          <strong>Note:</strong> Presentarsi 90 minuti prima della gara con
          documento, tuta sociale e borraccia.
        </div>
      </article>
    </section>
  );
}

export default Convocazioni;
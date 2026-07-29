function Avvisi() {
  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Comunicazioni della squadra</p>
        <h2>Avvisi</h2>
        <p>
          Tutte le informazioni importanti per giocatori e famiglie.
        </p>
      </div>

      <div className="avvisi-list">
        <article className="avviso-card avviso-importante">
          <div className="avviso-top">
            <span className="avviso-badge">Importante</span>
            <time>10 settembre 2026</time>
          </div>

          <h3>Consegna documenti per il tesseramento</h3>

          <p>
            Ricordiamo alle famiglie di consegnare allo staff la documentazione
            richiesta entro venerdì.
          </p>
        </article>

        <article className="avviso-card">
          <div className="avviso-top">
            <span className="avviso-badge avviso-badge-info">Allenamento</span>
            <time>8 settembre 2026</time>
          </div>

          <h3>Variazione orario allenamento</h3>

          <p>
            L'allenamento di giovedì inizierà alle ore 18:30. Il ritrovo è
            previsto quindici minuti prima.
          </p>
        </article>

        <article className="avviso-card">
          <div className="avviso-top">
            <span className="avviso-badge avviso-badge-info">Materiale</span>
            <time>5 settembre 2026</time>
          </div>

          <h3>Abbigliamento per le partite</h3>

          <p>
            I giocatori devono presentarsi con tuta sociale, borraccia
            personale e documento di riconoscimento.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Avvisi;
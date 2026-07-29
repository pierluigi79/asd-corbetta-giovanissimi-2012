function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <p className="hero-kicker">ASD Calcio Corbetta</p>

          <h1>Giovanissimi 2012</h1>

          <p className="hero-text">
            Il portale dedicato a giocatori, famiglie e staff della squadra.
          </p>

          <div className="hero-actions">
            <a href="/convocazioni" className="button button-primary">
              Vedi convocazioni
            </a>

            <a href="/avvisi" className="button button-secondary">
              Leggi gli avvisi
            </a>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>In evidenza</h2>

        <div className="home-cards">
          <article className="home-card">
            <h3>Prossima partita</h3>
            <p>
              Qui verranno mostrati data, orario, campo e avversario della
              prossima gara.
            </p>
          </article>

          <article className="home-card">
            <h3>Ultimi avvisi</h3>
            <p>
              Comunicazioni importanti per le famiglie e aggiornamenti dello
              staff.
            </p>
          </article>

          <article className="home-card">
            <h3>Galleria</h3>
            <p>
              Foto delle partite, degli allenamenti e dei momenti della
              squadra.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
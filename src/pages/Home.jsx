import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Home() {
  const [prossimaPartita, setProssimaPartita] = useState(null);
  const [ultimoAvviso, setUltimoAvviso] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    async function caricaInEvidenza() {
      const oggi = new Date().toISOString().split("T")[0];

      const [risultatoPartita, risultatoAvviso] = await Promise.all([
        supabase
          .from("convocazioni")
          .select("*")
          .eq("pubblicata", true)
          .gte("data_gara", oggi)
          .order("data_gara", { ascending: true })
          .order("ora_gara", { ascending: true })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("avvisi")
          .select("*")
          .order("data_pubblicazione", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!risultatoPartita.error) {
        setProssimaPartita(risultatoPartita.data);
      }

      if (!risultatoAvviso.error) {
        setUltimoAvviso(risultatoAvviso.data);
      }

      setCaricamento(false);
    }

    caricaInEvidenza();
  }, []);

  function formattaData(data) {
    if (!data) return "";

    const dataFormattata = new Date(`${data}T12:00:00`).toLocaleDateString(
      "it-IT",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );

    return (
      dataFormattata.charAt(0).toUpperCase() + dataFormattata.slice(1)
    );
  }

  function formattaOra(ora) {
    if (!ora) return "";

    return ora.slice(0, 5);
  }

  function titoloPartita(convocazione) {
    if (!convocazione) return "";

    return convocazione.sede === "casa"
      ? `Corbetta - ${convocazione.avversario}`
      : `${convocazione.avversario} - Corbetta`;
  }

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
            <Link to="/convocazioni" className="button button-primary">
              Vedi convocazioni
            </Link>

            <Link to="/avvisi" className="button button-secondary">
              Leggi gli avvisi
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>In evidenza</h2>

        <div className="home-cards">
          <article className="home-card">
            <h3>Prossima partita</h3>

            {caricamento ? (
              <p>Caricamento...</p>
            ) : prossimaPartita ? (
              <>
                <p>
                  <strong>{titoloPartita(prossimaPartita)}</strong>
                </p>

                <p>
                  {formattaData(prossimaPartita.data_gara)}
                  {prossimaPartita.ora_gara
                    ? ` · ore ${formattaOra(prossimaPartita.ora_gara)}`
                    : ""}
                </p>

                {prossimaPartita.campo && (
                  <p>
                    <strong>Campo:</strong> {prossimaPartita.campo}
                  </p>
                )}

                <Link
                  to="/convocazioni"
                  className="button button-primary"
                >
                  Vedi convocazione
                </Link>
              </>
            ) : (
              <p>Nessuna partita in programma.</p>
            )}
          </article>

          <article className="home-card">
            <h3>Ultimo avviso</h3>

            {caricamento ? (
              <p>Caricamento...</p>
            ) : ultimoAvviso ? (
              <>
                <p>
                  <strong>{ultimoAvviso.titolo}</strong>
                </p>

                <p className="home-avviso-preview">{ultimoAvviso.testo}</p>

                <Link
                  to="/avvisi"
                  className="button button-secondary"
                >
                  Leggi gli avvisi
                </Link>
              </>
            ) : (
              <p>Nessun avviso pubblicato.</p>
            )}
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
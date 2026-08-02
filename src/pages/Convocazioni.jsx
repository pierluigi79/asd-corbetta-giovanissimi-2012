import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Convocazioni() {
  const [convocazioni, setConvocazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaConvocazioni() {
      const oggi = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("convocazioni")
        .select("*")
        .eq("pubblicata", true)
        .gte("data_gara", oggi)
        .order("data_gara", { ascending: true })
        .order("ora_gara", { ascending: true });

      if (error) {
        setErrore(error.message);
      } else {
        setConvocazioni(data ?? []);
      }

      setCaricamento(false);
    }

    caricaConvocazioni();
  }, []);

  function formattaData(data) {
    if (!data) return "";

    const dataFormattata = new Date(`${data}T12:00:00`).toLocaleDateString(
      "it-IT",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
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

  if (caricamento) {
    return (
      <section>
        <h2>Convocazioni</h2>
        <p>Caricamento convocazioni...</p>
      </section>
    );
  }

  if (errore) {
    return (
      <section>
        <h2>Convocazioni</h2>

        <p className="form-message form-message-error">
          Errore nel caricamento: {errore}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Prossimi impegni</p>
        <h2>Convocazioni</h2>
        <p>Tutte le informazioni per le prossime partite.</p>
      </div>

      {convocazioni.length === 0 && (
        <p>Non ci sono convocazioni pubblicate.</p>
      )}

      <div className="convocazioni-list">
        {convocazioni.map((convocazione) => {
          const titoloPartita =
            convocazione.sede === "casa"
              ? `Corbetta - ${convocazione.avversario}`
              : `${convocazione.avversario} - Corbetta`;

          const convocati = [
            ...(convocazione.convocati_nomi ?? []),
          ].sort((a, b) => a.localeCompare(b, "it"));

          const indirizzoCompleto = [
            convocazione.indirizzo,
            convocazione.comune,
            "MI",
            "Italia",
          ]
            .filter(Boolean)
            .join(", ");

          const linkGoogleMaps = indirizzoCompleto
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                indirizzoCompleto
              )}`
            : "";

          return (
            <article
              key={convocazione.id}
              className="convocazione-card"
            >
              <div className="convocazione-header">
                <div>
                  <p className="convocazione-label">
                    {formattaData(convocazione.data_gara)}
                  </p>

                  <h3>{titoloPartita}</h3>
                </div>

                <span className="convocazione-badge">
                  {convocazione.competizione}
                </span>
              </div>

              <div className="convocazione-details">
                <p>
                  <strong>Raduno:</strong>{" "}
                  {formattaOra(convocazione.ora_ritrovo)}
                </p>

                <p>
                  <strong>Inizio partita:</strong>{" "}
                  {formattaOra(convocazione.ora_gara)}
                </p>

                <p>
                  <strong>Campo:</strong> {convocazione.campo}
                </p>

                <p>
                  <strong>Indirizzo:</strong>{" "}
                  {convocazione.indirizzo}
                  {convocazione.comune
                    ? `, ${convocazione.comune}`
                    : ""}
                </p>
              </div>

              {linkGoogleMaps && (
                <p>
                  <a
                    className="button button-primary"
                    href={linkGoogleMaps}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📍 Apri in Google Maps
                  </a>
                </p>
              )}

              {(convocazione.pre_raduno_luogo ||
                convocazione.pre_raduno_ora) && (
                <div className="convocazione-note">
                  <strong>Pre-raduno:</strong>{" "}
                  {convocazione.pre_raduno_luogo || ""}
                  {convocazione.pre_raduno_ora
                    ? ` alle ${formattaOra(
                        convocazione.pre_raduno_ora
                      )}`
                    : ""}
                </div>
              )}

              <div className="convocati-section">
                <h3>Convocati</h3>

                <div className="convocati-grid">
                  {convocati.map((giocatore, indice) => (
                    <span key={`${convocazione.id}-${giocatore}`}>
                      {indice + 1}. {giocatore}
                    </span>
                  ))}
                </div>
              </div>

              {convocazione.note && (
                <div className="convocazione-note">
                  <strong>Note:</strong> {convocazione.note}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Convocazioni;
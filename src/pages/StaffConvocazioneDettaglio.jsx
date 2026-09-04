import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function StaffConvocazioneDettaglio() {
  const { id } = useParams();

  const [convocazione, setConvocazione] = useState(null);
  const [convocati, setConvocati] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaDettaglio() {
      setCaricamento(true);
      setErrore("");

      const {
        data: datiConvocazione,
        error: erroreConvocazione,
      } = await supabase
        .from("convocazioni")
        .select("*")
        .eq("id", id)
        .single();

      if (erroreConvocazione) {
        setErrore(
          `Errore nel caricamento della convocazione: ${erroreConvocazione.message}`
        );
        setCaricamento(false);
        return;
      }

      const {
        data: datiConvocati,
        error: erroreConvocati,
      } = await supabase
        .from("convocati")
        .select(
          `
          id,
          convocazione_id,
          giocatore_id,
          numero_maglia,
          capitano,
          vice_capitano,
          persone (
            id,
            cognome,
            nome
          )
          `
        )
        .eq("convocazione_id", id);

      if (erroreConvocati) {
        setErrore(
          `Errore nel caricamento dei convocati: ${erroreConvocati.message}`
        );
        setCaricamento(false);
        return;
      }

      const convocatiOrdinati = [...(datiConvocati ?? [])].sort(
        (a, b) => {
          const cognomeA = a.persone?.cognome ?? "";
          const cognomeB = b.persone?.cognome ?? "";

          const confrontoCognome = cognomeA.localeCompare(
            cognomeB,
            "it"
          );

          if (confrontoCognome !== 0) {
            return confrontoCognome;
          }

          const nomeA = a.persone?.nome ?? "";
          const nomeB = b.persone?.nome ?? "";

          return nomeA.localeCompare(nomeB, "it");
        }
      );

      setConvocazione(datiConvocazione);
      setConvocati(convocatiOrdinati);
      setCaricamento(false);
    }

    caricaDettaglio();
  }, [id]);

  function formattaData(data) {
    if (!data) return "—";

    return new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(`${data}T12:00:00`));
  }

  function formattaOra(ora) {
    if (!ora) return "—";

    return ora.slice(0, 5);
  }

  function formattaDataOra(dataOra) {
    if (!dataOra) return "—";

    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dataOra));
  }

  function titoloPartita() {
    if (!convocazione) return "";

    return convocazione.sede === "trasferta"
      ? `${convocazione.avversario} - Corbetta`
      : `Corbetta - ${convocazione.avversario}`;
  }

  if (caricamento) {
    return (
      <section>
        <p>Caricamento dettaglio convocazione...</p>
      </section>
    );
  }

  if (errore) {
    return (
      <section>
        <div className="page-heading">
          <p className="page-kicker">Area Staff</p>
          <h2>Dettaglio convocazione</h2>
        </div>

        <p className="form-message form-message-error">
          {errore}
        </p>

        <Link
          className="button button-primary"
          to="/staff/convocazioni-elenco"
        >
          Torna alle convocazioni
        </Link>
      </section>
    );
  }

  if (!convocazione) {
    return (
      <section>
        <p>Convocazione non trovata.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">
          Area Staff · Dati riservati
        </p>

        <h2>{titoloPartita()}</h2>
        <p>{convocazione.competizione}</p>
      </div>

      <div className="staff-dettaglio-top">
        <Link
          className="button button-secondary"
          to="/staff/convocazioni-elenco"
        >
          ← Torna alle convocazioni
        </Link>

        <span
          className={
            convocazione.pubblicata
              ? "convocazione-status pubblicata"
              : "convocazione-status bozza"
          }
        >
          {convocazione.pubblicata
            ? "Pubblicata"
            : "Bozza"}
        </span>
      </div>

      <div className="staff-dettaglio-card">
        <h3>Dati della gara</h3>

        <div className="staff-dettaglio-grid">
          <div>
            <span>Data</span>
            <strong>
              {formattaData(convocazione.data_gara)}
            </strong>
          </div>

          <div>
            <span>Ora partita</span>
            <strong>
              {formattaOra(convocazione.ora_gara)}
            </strong>
          </div>

          <div>
            <span>Ora ritrovo</span>
            <strong>
              {formattaOra(convocazione.ora_ritrovo)}
            </strong>
          </div>

          <div>
            <span>Campo</span>
            <strong>
              {convocazione.campo || "—"}
            </strong>
          </div>

          <div>
            <span>Indirizzo</span>
            <strong>
              {convocazione.indirizzo || "—"}
            </strong>
          </div>

          <div>
            <span>Comune</span>
            <strong>
              {convocazione.comune || "—"}
            </strong>
          </div>
        </div>
      </div>

      {(convocazione.pre_raduno_luogo ||
        convocazione.pre_raduno_ora) && (
        <div className="staff-dettaglio-card">
          <h3>Pre-raduno</h3>

          <div className="staff-dettaglio-grid">
            <div>
              <span>Luogo</span>
              <strong>
                {convocazione.pre_raduno_luogo || "—"}
              </strong>
            </div>

            <div>
              <span>Ora</span>
              <strong>
                {formattaOra(
                  convocazione.pre_raduno_ora
                )}
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className="staff-dettaglio-card">
        <div className="dati-convocati-heading">
          <div>
            <h3>Convocati · Dati riservati Staff</h3>

            <p>
              Numero di maglia, Capitano e Vice capitano
              non sono visibili nella convocazione destinata
              alle famiglie.
            </p>
          </div>
        </div>

        {convocati.length === 0 ? (
          <p>Nessun convocato associato.</p>
        ) : (
          <div className="staff-convocati-completi">
            <div className="staff-convocati-completi-header">
              <span>Giocatore</span>
              <span>Maglia</span>
              <span>Ruolo</span>
            </div>

            {convocati.map((convocato) => {
              let ruolo = "—";

              if (convocato.capitano === true) {
                ruolo = "Capitano";
              }

              if (convocato.vice_capitano === true) {
                ruolo = "Vice capitano";
              }

              return (
                <div
                  key={convocato.id}
                  className="staff-convocato-completo-row"
                >
                  <strong>
                    {convocato.persone?.cognome}{" "}
                    {convocato.persone?.nome}
                  </strong>

                  <span className="numero-maglia-badge">
                    {convocato.numero_maglia ?? "—"}
                  </span>

                  <span
                    className={
                      convocato.capitano === true ||
                      convocato.vice_capitano === true
                        ? "ruolo-staff evidenza"
                        : "ruolo-staff"
                    }
                  >
                    {ruolo}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {convocazione.note && (
        <div className="staff-dettaglio-card">
          <h3>Note</h3>
          <p>{convocazione.note}</p>
        </div>
      )}

      <div className="staff-dettaglio-card staff-dettaglio-meta">
        <p>
          <strong>Creata:</strong>{" "}
          {formattaDataOra(convocazione.created_at)}
        </p>

        <p>
          <strong>Ultimo aggiornamento:</strong>{" "}
          {formattaDataOra(convocazione.updated_at)}
        </p>
      </div>
    </section>
  );
}

export default StaffConvocazioneDettaglio;
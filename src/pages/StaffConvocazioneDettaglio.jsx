import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function StaffConvocazioneDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [convocazione, setConvocazione] = useState(null);
  const [convocati, setConvocati] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [creazioneBozza, setCreazioneBozza] = useState(false);
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
          const numeroA =
            a.numero_maglia === null
              ? Number.MAX_SAFE_INTEGER
              : Number(a.numero_maglia);

          const numeroB =
            b.numero_maglia === null
              ? Number.MAX_SAFE_INTEGER
              : Number(b.numero_maglia);

          if (numeroA !== numeroB) {
            return numeroA - numeroB;
          }

          const cognomeA = a.persone?.cognome ?? "";
          const cognomeB = b.persone?.cognome ?? "";

          return cognomeA.localeCompare(cognomeB, "it");
        }
      );

      setConvocazione(datiConvocazione);
      setConvocati(convocatiOrdinati);
      setCaricamento(false);
    }

    caricaDettaglio();
  }, [id]);

  async function modificaConvocazione() {
    if (!convocazione || creazioneBozza) {
      return;
    }

    setErrore("");
    setCreazioneBozza(true);

    const {
      data: bozzaEsistente,
      error: erroreRicercaBozza,
    } = await supabase
      .from("convocazioni")
      .select("id")
      .eq("sostituisce_convocazione_id", convocazione.id)
      .eq("pubblicata", false)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (erroreRicercaBozza) {
      setErrore(
        `Errore nella ricerca della bozza: ${erroreRicercaBozza.message}`
      );
      setCreazioneBozza(false);
      return;
    }

    if (bozzaEsistente) {
      navigate(
        `/staff/convocazione/${bozzaEsistente.id}/modifica`
      );
      return;
    }

    const nuovaConvocazione = {
      competizione: convocazione.competizione,
      avversario: convocazione.avversario,
      data_gara: convocazione.data_gara,
      ora_ritrovo: convocazione.ora_ritrovo,
      ora_gara: convocazione.ora_gara,
      campo: convocazione.campo,
      indirizzo: convocazione.indirizzo,
      note: convocazione.note,
      pubblicata: false,
      sede: convocazione.sede,
      pre_raduno_luogo: convocazione.pre_raduno_luogo,
      pre_raduno_ora: convocazione.pre_raduno_ora,
      comune: convocazione.comune,
      sostituisce_convocazione_id: convocazione.id,
    };

    const {
      data: bozzaCreata,
      error: erroreCreazioneBozza,
    } = await supabase
      .from("convocazioni")
      .insert(nuovaConvocazione)
      .select("id")
      .single();

    if (erroreCreazioneBozza) {
      setErrore(
        `Errore nella creazione della bozza: ${erroreCreazioneBozza.message}`
      );
      setCreazioneBozza(false);
      return;
    }

    if (convocati.length > 0) {
      const convocatiDaCopiare = convocati.map((convocato) => ({
        convocazione_id: bozzaCreata.id,
        giocatore_id: convocato.giocatore_id,
        numero_maglia: convocato.numero_maglia,
        capitano: convocato.capitano,
        vice_capitano: convocato.vice_capitano,
      }));

      const { error: erroreCopiaConvocati } = await supabase
        .from("convocati")
        .insert(convocatiDaCopiare);

      if (erroreCopiaConvocati) {
        await supabase
          .from("convocazioni")
          .delete()
          .eq("id", bozzaCreata.id);

        setErrore(
          `La bozza non è stata creata correttamente: ${erroreCopiaConvocati.message}`
        );
        setCreazioneBozza(false);
        return;
      }
    }

    navigate(`/staff/convocazione/${bozzaCreata.id}/modifica`);
  }

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

  if (errore && !convocazione) {
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
          className="button button-secondary staff-back-button"
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

      {errore && (
        <p className="form-message form-message-error">
          {errore}
        </p>
      )}

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
            <strong>{convocazione.campo || "—"}</strong>
          </div>

          <div>
            <span>Indirizzo</span>
            <strong>{convocazione.indirizzo || "—"}</strong>
          </div>

          <div>
            <span>Comune</span>
            <strong>{convocazione.comune || "—"}</strong>
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

      <div className="staff-convocazione-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={modificaConvocazione}
          disabled={creazioneBozza}
        >
          {creazioneBozza
            ? "Preparazione bozza..."
            : "Modifica convocazione"}
        </button>
      </div>
    </section>
  );
}

export default StaffConvocazioneDettaglio;
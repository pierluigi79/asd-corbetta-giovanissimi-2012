import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function StaffConvocazioneModifica() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [giocatori, setGiocatori] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [salvataggio, setSalvataggio] = useState(false);
  const [pubblicazione, setPubblicazione] = useState(false);

  const [competizione, setCompetizione] = useState("Campionato");
  const [sede, setSede] = useState("casa");
  const [avversario, setAvversario] = useState("");
  const [dataGara, setDataGara] = useState("");
  const [campo, setCampo] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [comune, setComune] = useState("");
  const [oraRaduno, setOraRaduno] = useState("");
  const [oraGara, setOraGara] = useState("");
  const [preRadunoLuogo, setPreRadunoLuogo] = useState("");
  const [preRadunoOra, setPreRadunoOra] = useState("");

  const [convocati, setConvocati] = useState([]);
  const [numeriMaglia, setNumeriMaglia] = useState({});
  const [capitanoId, setCapitanoId] = useState("");
  const [viceCapitanoId, setViceCapitanoId] = useState("");

  const [note, setNote] = useState("");

  const [
    sostituisceConvocazioneId,
    setSostituisceConvocazioneId,
  ] = useState(null);

  const [errore, setErrore] = useState("");
  const [messaggio, setMessaggio] = useState("");

  useEffect(() => {
    async function caricaBozza() {
      setCaricamento(true);
      setErrore("");

      const [
        risultatoGiocatori,
        risultatoConvocazione,
        risultatoConvocati,
      ] = await Promise.all([
        supabase
          .from("persone")
          .select("id, cognome, nome")
          .eq("tipo_persona", "giocatore")
          .eq("attivo", true)
          .order("cognome", { ascending: true })
          .order("nome", { ascending: true }),

        supabase
          .from("convocazioni")
          .select("*")
          .eq("id", id)
          .single(),

        supabase
          .from("convocati")
          .select(
            `
            id,
            giocatore_id,
            numero_maglia,
            capitano,
            vice_capitano
            `
          )
          .eq("convocazione_id", id),
      ]);

      if (risultatoGiocatori.error) {
        setErrore(
          `Errore nel caricamento della rosa: ${risultatoGiocatori.error.message}`
        );
        setCaricamento(false);
        return;
      }

      if (risultatoConvocazione.error) {
        setErrore(
          `Errore nel caricamento della bozza: ${risultatoConvocazione.error.message}`
        );
        setCaricamento(false);
        return;
      }

      if (risultatoConvocati.error) {
        setErrore(
          `Errore nel caricamento dei convocati: ${risultatoConvocati.error.message}`
        );
        setCaricamento(false);
        return;
      }

      const bozza = risultatoConvocazione.data;

      if (bozza.pubblicata) {
        setErrore(
          "Questa convocazione è già pubblicata e non può essere modificata da questa schermata."
        );
        setCaricamento(false);
        return;
      }

      if (!bozza.sostituisce_convocazione_id) {
        setErrore(
          "La bozza non risulta collegata a una convocazione precedente."
        );
        setCaricamento(false);
        return;
      }

      const datiConvocati =
        risultatoConvocati.data ?? [];

      const idsConvocati = datiConvocati.map(
        (convocato) => convocato.giocatore_id
      );

      const numeri = {};

      datiConvocati.forEach((convocato) => {
        numeri[convocato.giocatore_id] =
          convocato.numero_maglia ?? "";
      });

      const capitano = datiConvocati.find(
        (convocato) => convocato.capitano === true
      );

      const viceCapitano = datiConvocati.find(
        (convocato) =>
          convocato.vice_capitano === true
      );

      setGiocatori(
        risultatoGiocatori.data ?? []
      );

      setCompetizione(
        bozza.competizione ?? "Campionato"
      );
      setSede(bozza.sede ?? "casa");
      setAvversario(bozza.avversario ?? "");
      setDataGara(bozza.data_gara ?? "");
      setCampo(bozza.campo ?? "");
      setIndirizzo(bozza.indirizzo ?? "");
      setComune(bozza.comune ?? "");

      setOraRaduno(
        bozza.ora_ritrovo
          ? bozza.ora_ritrovo.slice(0, 5)
          : ""
      );

      setOraGara(
        bozza.ora_gara
          ? bozza.ora_gara.slice(0, 5)
          : ""
      );

      setPreRadunoLuogo(
        bozza.pre_raduno_luogo ?? ""
      );

      setPreRadunoOra(
        bozza.pre_raduno_ora
          ? bozza.pre_raduno_ora.slice(0, 5)
          : ""
      );

      setConvocati(idsConvocati);
      setNumeriMaglia(numeri);

      setCapitanoId(
        capitano?.giocatore_id ?? ""
      );

      setViceCapitanoId(
        viceCapitano?.giocatore_id ?? ""
      );

      setNote(bozza.note ?? "");

      setSostituisceConvocazioneId(
        bozza.sostituisce_convocazione_id
      );

      setCaricamento(false);
    }

    caricaBozza();
  }, [id]);

  const titoloPartita = useMemo(() => {
    const nomeAvversario =
      avversario.trim() || "Avversario";

    return sede === "casa"
      ? `Corbetta - ${nomeAvversario}`
      : `${nomeAvversario} - Corbetta`;
  }, [avversario, sede]);

  const giocatoriConvocati = useMemo(
    () =>
      giocatori.filter((giocatore) =>
        convocati.includes(giocatore.id)
      ),
    [giocatori, convocati]
  );

  function cambiaConvocato(giocatoreId) {
    setConvocati((precedenti) => {
      if (precedenti.includes(giocatoreId)) {
        setNumeriMaglia((numeriPrecedenti) => {
          const nuoviNumeri = {
            ...numeriPrecedenti,
          };

          delete nuoviNumeri[giocatoreId];

          return nuoviNumeri;
        });

        if (capitanoId === giocatoreId) {
          setCapitanoId("");
        }

        if (viceCapitanoId === giocatoreId) {
          setViceCapitanoId("");
        }

        return precedenti.filter(
          (convocatoId) =>
            convocatoId !== giocatoreId
        );
      }

      return [...precedenti, giocatoreId];
    });
  }

  function cambiaNumeroMaglia(
    giocatoreId,
    valore
  ) {
    setNumeriMaglia((precedenti) => ({
      ...precedenti,
      [giocatoreId]: valore,
    }));
  }

  function selezionaCapitano(giocatoreId) {
    setCapitanoId(giocatoreId);

    if (viceCapitanoId === giocatoreId) {
      setViceCapitanoId("");
    }
  }

  function selezionaViceCapitano(
    giocatoreId
  ) {
    setViceCapitanoId(giocatoreId);

    if (capitanoId === giocatoreId) {
      setCapitanoId("");
    }
  }

  function selezionaTutti() {
    if (convocati.length === giocatori.length) {
      setConvocati([]);
      setNumeriMaglia({});
      setCapitanoId("");
      setViceCapitanoId("");
      return;
    }

    setConvocati(
      giocatori.map(
        (giocatore) => giocatore.id
      )
    );
  }

  function validaConvocati() {
    if (convocati.length === 0) {
      return "Seleziona almeno un giocatore convocato.";
    }

    for (const giocatoreId of convocati) {
      const numero = String(
        numeriMaglia[giocatoreId] ?? ""
      ).trim();

      if (!numero) {
        return "Assegna un numero di maglia a tutti i giocatori convocati.";
      }

      const numeroConvertito =
        Number(numero);

      if (
        !Number.isInteger(numeroConvertito) ||
        numeroConvertito <= 0
      ) {
        return "I numeri di maglia devono essere numeri interi maggiori di zero.";
      }
    }

    const numeri = convocati.map(
      (giocatoreId) =>
        Number(numeriMaglia[giocatoreId])
    );

    if (
      new Set(numeri).size !== numeri.length
    ) {
      return "Non puoi assegnare lo stesso numero di maglia a due giocatori.";
    }

    if (!capitanoId) {
      return "Seleziona il capitano.";
    }

    if (!viceCapitanoId) {
      return "Seleziona il vice capitano.";
    }

    if (
      capitanoId === viceCapitanoId
    ) {
      return "Capitano e vice capitano devono essere due giocatori diversi.";
    }

    return "";
  }

  function preparaNomiConvocati() {
    return giocatoriConvocati
      .map(
        (giocatore) =>
          `${giocatore.cognome} ${giocatore.nome}`
      )
      .sort((a, b) =>
        a.localeCompare(b, "it")
      );
  }

  function preparaRigheConvocati() {
    return convocati.map(
      (giocatoreId) => ({
        convocazione_id: Number(id),
        giocatore_id: giocatoreId,
        numero_maglia: Number(
          numeriMaglia[giocatoreId]
        ),
        capitano:
          giocatoreId === capitanoId,
        vice_capitano:
          giocatoreId === viceCapitanoId,
      })
    );
  }

  async function salvaBozzaInterna() {
    const erroreValidazione =
      validaConvocati();

    if (erroreValidazione) {
      return {
        ok: false,
        messaggio: erroreValidazione,
      };
    }

    const nomiConvocati =
      preparaNomiConvocati();

    const {
      error: erroreAggiornamento,
    } = await supabase
      .from("convocazioni")
      .update({
        competizione,
        avversario: avversario.trim(),
        data_gara: dataGara,
        ora_ritrovo: oraRaduno || null,
        ora_gara: oraGara || null,
        campo: campo.trim(),
        indirizzo: indirizzo.trim(),
        comune: comune.trim(),
        note: note.trim() || null,
        sede,
        pre_raduno_luogo:
          preRadunoLuogo.trim() || null,
        pre_raduno_ora:
          preRadunoOra || null,
        convocati_nomi:
          nomiConvocati,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

    if (erroreAggiornamento) {
      return {
        ok: false,
        messaggio:
          "Errore nell'aggiornamento della bozza: " +
          erroreAggiornamento.message,
      };
    }

    const {
      error: erroreEliminazioneConvocati,
    } = await supabase
      .from("convocati")
      .delete()
      .eq("convocazione_id", id);

    if (erroreEliminazioneConvocati) {
      return {
        ok: false,
        messaggio:
          "Errore nell'aggiornamento dei convocati: " +
          erroreEliminazioneConvocati.message,
      };
    }

    const righeConvocati =
      preparaRigheConvocati();

    const {
      error: erroreInserimentoConvocati,
    } = await supabase
      .from("convocati")
      .insert(righeConvocati);

    if (erroreInserimentoConvocati) {
      return {
        ok: false,
        messaggio:
          "Errore nel salvataggio dei convocati: " +
          erroreInserimentoConvocati.message,
      };
    }

    return {
      ok: true,
      messaggio: "",
    };
  }

  async function salvaBozza(event) {
    event.preventDefault();

    setErrore("");
    setMessaggio("");
    setSalvataggio(true);

    const risultato =
      await salvaBozzaInterna();

    setSalvataggio(false);

    if (!risultato.ok) {
      setErrore(risultato.messaggio);
      return;
    }

    setMessaggio(
      "Bozza salvata correttamente. La convocazione visibile alle famiglie non è stata modificata."
    );
  }

async function pubblicaNuovaVersione() {
  setErrore("");
  setMessaggio("");

  if (!sostituisceConvocazioneId) {
    setErrore(
      "Impossibile individuare la convocazione precedente da sostituire."
    );
    return;
  }

  setPubblicazione(true);

  const risultatoSalvataggio =
    await salvaBozzaInterna();

  if (!risultatoSalvataggio.ok) {
    setPubblicazione(false);
    setErrore(risultatoSalvataggio.messaggio);
    return;
  }

  const { error: errorePubblicazione } =
    await supabase
      .from("convocazioni")
      .update({
        pubblicata: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

  if (errorePubblicazione) {
    setPubblicazione(false);

    setErrore(
      "Errore nella pubblicazione della nuova versione: " +
        errorePubblicazione.message
    );

    return;
  }

  /*
   * Risaliamo tutta la catena delle versioni precedenti.
   * Esempio:
   * 20 <- 21 <- 22
   *
   * Se pubblichiamo 22, devono diventare false sia 21 che 20.
   */
  const idsDaDisattivare = [];
  let idCorrente = sostituisceConvocazioneId;

  while (idCorrente) {
    idsDaDisattivare.push(idCorrente);

    const {
      data: versionePrecedente,
      error: erroreVersionePrecedente,
    } = await supabase
      .from("convocazioni")
      .select("sostituisce_convocazione_id")
      .eq("id", idCorrente)
      .single();

    if (erroreVersionePrecedente) {
      await supabase
        .from("convocazioni")
        .update({
          pubblicata: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      setPubblicazione(false);

      setErrore(
        "La nuova versione non è stata pubblicata perché non è stato possibile ricostruire correttamente lo storico delle versioni."
      );

      return;
    }

    idCorrente =
      versionePrecedente.sostituisce_convocazione_id;
  }

  if (idsDaDisattivare.length > 0) {
    const {
      error: erroreDisattivazionePrecedenti,
    } = await supabase
      .from("convocazioni")
      .update({
        pubblicata: false,
        updated_at: new Date().toISOString(),
      })
      .in("id", idsDaDisattivare);

    if (erroreDisattivazionePrecedenti) {
      await supabase
        .from("convocazioni")
        .update({
          pubblicata: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      setPubblicazione(false);

      setErrore(
        "La nuova versione non è stata pubblicata perché non è stato possibile sostituire correttamente tutte le versioni precedenti."
      );

      return;
    }
  }

  setPubblicazione(false);

  navigate(`/staff/convocazione/${id}`);
}

  if (caricamento) {
    return (
      <section>
        <p>Caricamento bozza...</p>
      </section>
    );
  }

  if (
    errore &&
    giocatori.length === 0
  ) {
    return (
      <section>
        <div className="page-heading">
          <p className="page-kicker">
            Area Staff
          </p>

          <h2>
            Modifica convocazione
          </h2>
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

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">
          Area Staff · Bozza
        </p>

        <h2>Modifica convocazione</h2>

        <p>
          La versione attualmente
          pubblicata resta visibile alle
          famiglie fino alla nuova
          pubblicazione.
        </p>
      </div>

      <div className="staff-dettaglio-top">
        <Link
          className="button button-secondary staff-back-button"
          to="/staff/convocazioni-elenco"
        >
          ← Torna alle convocazioni
        </Link>

        <span className="convocazione-status bozza">
          Bozza
        </span>
      </div>

      <form
        className="convocazione-form"
        onSubmit={salvaBozza}
      >
        <div className="convocazione-form-section">
          <h3>Dati della partita</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="competizione">
                Competizione
              </label>

              <select
                id="competizione"
                value={competizione}
                onChange={(event) =>
                  setCompetizione(
                    event.target.value
                  )
                }
              >
                <option>Campionato</option>
                <option>Torneo</option>
                <option>Amichevole</option>
              </select>
            </div>

            <div className="form-field">
              <span className="form-label">
                Dove si gioca?
              </span>

              <div className="sede-selector">
                <button
                  type="button"
                  className={
                    sede === "casa"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSede("casa")
                  }
                >
                  In casa
                </button>

                <button
                  type="button"
                  className={
                    sede === "trasferta"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSede("trasferta")
                  }
                >
                  In trasferta
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="avversario">
                Avversario
              </label>

              <input
                id="avversario"
                type="text"
                value={avversario}
                onChange={(event) =>
                  setAvversario(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="data-gara">
                Data
              </label>

              <input
                id="data-gara"
                type="date"
                value={dataGara}
                onChange={(event) =>
                  setDataGara(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="partita-preview form-field-full">
              <span>
                Anteprima partita
              </span>

              <strong>
                {titoloPartita}
              </strong>

              <small>
                {competizione}
              </small>
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <h3>Campo e orari</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="campo">
                Campo
              </label>

              <input
                id="campo"
                type="text"
                value={campo}
                onChange={(event) =>
                  setCampo(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="indirizzo">
                Indirizzo
              </label>

              <input
                id="indirizzo"
                type="text"
                value={indirizzo}
                onChange={(event) =>
                  setIndirizzo(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="comune">
                Comune
              </label>

              <input
                id="comune"
                type="text"
                value={comune}
                onChange={(event) =>
                  setComune(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ora-raduno">
                Ora raduno
              </label>

              <input
                id="ora-raduno"
                type="time"
                value={oraRaduno}
                onChange={(event) =>
                  setOraRaduno(
                    event.target.value
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ora-gara">
                Ora partita
              </label>

              <input
                id="ora-gara"
                type="time"
                value={oraGara}
                onChange={(event) =>
                  setOraGara(
                    event.target.value
                  )
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <h3>
            Pre-raduno facoltativo
          </h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="pre-raduno-luogo">
                Luogo
              </label>

              <input
                id="pre-raduno-luogo"
                type="text"
                value={
                  preRadunoLuogo
                }
                onChange={(event) =>
                  setPreRadunoLuogo(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="pre-raduno-ora">
                Ora
              </label>

              <input
                id="pre-raduno-ora"
                type="time"
                value={preRadunoOra}
                onChange={(event) =>
                  setPreRadunoOra(
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <div className="convocati-heading">
            <div>
              <h3>Convocati</h3>
              <p>
                Selezionati:{" "}
                {convocati.length}
              </p>
            </div>

            <button
              type="button"
              className="select-all-button"
              onClick={selezionaTutti}
            >
              {convocati.length ===
              giocatori.length
                ? "Deseleziona tutti"
                : "Seleziona tutti"}
            </button>
          </div>

          <div className="giocatori-checkbox-grid">
            {giocatori.map(
              (giocatore) => {
                const nomeCompleto =
                  `${giocatore.cognome} ${giocatore.nome}`;

                return (
                  <label
                    key={
                      giocatore.id
                    }
                    className="giocatore-checkbox"
                  >
                    <input
                      type="checkbox"
                      checked={convocati.includes(
                        giocatore.id
                      )}
                      onChange={() =>
                        cambiaConvocato(
                          giocatore.id
                        )
                      }
                    />

                    <span>
                      {nomeCompleto}
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </div>

        {giocatoriConvocati.length >
          0 && (
          <div className="convocazione-form-section">
            <div className="dati-convocati-heading">
              <div>
                <h3>
                  Dati riservati Staff
                </h3>

                <p>
                  Numero di maglia,
                  Capitano e Vice
                  capitano non saranno
                  visibili alle famiglie.
                </p>
              </div>
            </div>

            <div className="dati-convocati-list">
              <div className="dati-convocati-header">
                <span>Giocatore</span>
                <span>Maglia</span>
                <span>Capitano</span>
                <span>Vice</span>
              </div>

              {giocatoriConvocati.map(
                (giocatore) => (
                  <div
                    key={
                      giocatore.id
                    }
                    className="dati-convocato-row"
                  >
                    <strong>
                      {
                        giocatore.cognome
                      }{" "}
                      {
                        giocatore.nome
                      }
                    </strong>

                    <input
                      className="maglia-input"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={
                        numeriMaglia[
                          giocatore.id
                        ] ?? ""
                      }
                      onChange={(
                        event
                      ) =>
                        cambiaNumeroMaglia(
                          giocatore.id,
                          event.target
                            .value
                        )
                      }
                    />

                    <label className="ruolo-radio">
                      <input
                        type="radio"
                        name="capitano"
                        checked={
                          capitanoId ===
                          giocatore.id
                        }
                        onChange={() =>
                          selezionaCapitano(
                            giocatore.id
                          )
                        }
                      />

                      <span>
                        Capitano
                      </span>
                    </label>

                    <label className="ruolo-radio">
                      <input
                        type="radio"
                        name="vice-capitano"
                        checked={
                          viceCapitanoId ===
                          giocatore.id
                        }
                        onChange={() =>
                          selezionaViceCapitano(
                            giocatore.id
                          )
                        }
                      />

                      <span>Vice</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="convocazione-form-section">
          <div className="form-field">
            <label htmlFor="note">
              Note
            </label>

            <textarea
              id="note"
              rows="6"
              value={note}
              onChange={(event) =>
                setNote(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        {errore && (
          <p className="form-message form-message-error">
            {errore}
          </p>
        )}

        {messaggio && (
          <p className="form-message form-message-success">
            {messaggio}
          </p>
        )}

        <div className="form-actions">
          <button
            className="button button-secondary staff-draft-button"
            type="submit"
            disabled={
              salvataggio ||
              pubblicazione
            }
          >
            {salvataggio
              ? "Salvataggio..."
              : "Salva bozza"}
          </button>

          <button
            className="button button-primary staff-submit-button"
            type="button"
            onClick={
              pubblicaNuovaVersione
            }
            disabled={
              salvataggio ||
              pubblicazione
            }
          >
            {pubblicazione
              ? "Pubblicazione in corso..."
              : "Pubblica nuova versione"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default StaffConvocazioneModifica;
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function StaffConvocazioni() {
  const [giocatori, setGiocatori] = useState([]);
  const [caricamentoGiocatori, setCaricamentoGiocatori] = useState(true);
  const [erroreGiocatori, setErroreGiocatori] = useState("");

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

  const [note, setNote] = useState(
    "Si raccomanda di avvisare in caso di indisponibilità."
  );

  const [caricamento, setCaricamento] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaGiocatori() {
      const { data, error } = await supabase
        .from("persone")
        .select("id, cognome, nome")
        .eq("tipo_persona", "giocatore")
        .eq("attivo", true)
        .order("cognome", { ascending: true })
        .order("nome", { ascending: true });

      if (error) {
        setErroreGiocatori(error.message);
      } else {
        setGiocatori(data ?? []);
      }

      setCaricamentoGiocatori(false);
    }

    caricaGiocatori();
  }, []);

  const titoloPartita = useMemo(() => {
    const nomeAvversario = avversario.trim() || "Avversario";

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
          const nuoviNumeri = { ...numeriPrecedenti };
          delete nuoviNumeri[giocatoreId];
          return nuoviNumeri;
        });

        if (capitanoId === giocatoreId) {
          setCapitanoId("");
        }

        if (viceCapitanoId === giocatoreId) {
          setViceCapitanoId("");
        }

        return precedenti.filter((id) => id !== giocatoreId);
      }

      return [...precedenti, giocatoreId];
    });
  }

  function cambiaNumeroMaglia(giocatoreId, valore) {
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

  function selezionaViceCapitano(giocatoreId) {
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

    setConvocati(giocatori.map((giocatore) => giocatore.id));
  }

  function validaConvocati() {
    for (const giocatoreId of convocati) {
      const numero = String(
        numeriMaglia[giocatoreId] ?? ""
      ).trim();

      if (!numero) {
        return "Assegna un numero di maglia a tutti i giocatori convocati.";
      }

      const numeroConvertito = Number(numero);

      if (
        !Number.isInteger(numeroConvertito) ||
        numeroConvertito <= 0
      ) {
        return "I numeri di maglia devono essere numeri interi maggiori di zero.";
      }
    }

    const numeri = convocati.map((giocatoreId) =>
      Number(numeriMaglia[giocatoreId])
    );

    if (new Set(numeri).size !== numeri.length) {
      return "Non puoi assegnare lo stesso numero di maglia a due giocatori.";
    }

    if (!capitanoId) {
      return "Seleziona il capitano.";
    }

    if (!viceCapitanoId) {
      return "Seleziona il vice capitano.";
    }

    if (capitanoId === viceCapitanoId) {
      return "Capitano e vice capitano devono essere due giocatori diversi.";
    }

    return "";
  }

  async function pubblicaConvocazione(event) {
    event.preventDefault();

    setMessaggio("");
    setErrore("");

    if (convocati.length === 0) {
      setErrore("Seleziona almeno un giocatore convocato.");
      return;
    }

    const erroreValidazione = validaConvocati();

    if (erroreValidazione) {
      setErrore(erroreValidazione);
      return;
    }

    setCaricamento(true);

    const nomiConvocati = giocatoriConvocati
      .map(
        (giocatore) =>
          `${giocatore.cognome} ${giocatore.nome}`
      )
      .sort((a, b) => a.localeCompare(b, "it"));

    const {
      data: convocazioneCreata,
      error: erroreConvocazione,
    } = await supabase
      .from("convocazioni")
      .insert({
        competizione,
        avversario: avversario.trim(),
        data_gara: dataGara,
        ora_ritrovo: oraRaduno,
        ora_gara: oraGara,
        campo: campo.trim(),
        indirizzo: indirizzo.trim(),
        comune: comune.trim(),
        note: note.trim() || null,
        pubblicata: true,
        sede,
        pre_raduno_luogo:
          preRadunoLuogo.trim() || null,
        pre_raduno_ora: preRadunoOra || null,
        convocati_nomi: nomiConvocati,
      })
      .select("id")
      .single();

    if (erroreConvocazione) {
      setCaricamento(false);
      setErrore(erroreConvocazione.message);
      return;
    }

    const righeConvocati = convocati.map(
      (giocatoreId) => ({
        convocazione_id: convocazioneCreata.id,
        giocatore_id: giocatoreId,
        numero_maglia: Number(
          numeriMaglia[giocatoreId]
        ),
        capitano: giocatoreId === capitanoId,
        vice_capitano:
          giocatoreId === viceCapitanoId,
      })
    );

    const { error: erroreConvocati } =
      await supabase
        .from("convocati")
        .insert(righeConvocati);

    if (erroreConvocati) {
      await supabase
        .from("convocazioni")
        .delete()
        .eq("id", convocazioneCreata.id);

      setCaricamento(false);
      setErrore(
        `Errore nel salvataggio dei convocati: ${erroreConvocati.message}`
      );
      return;
    }

    setCaricamento(false);

    setMessaggio(
      `Convocazione pubblicata: ${titoloPartita}`
    );

    setCompetizione("Campionato");
    setSede("casa");
    setAvversario("");
    setDataGara("");
    setCampo("");
    setIndirizzo("");
    setComune("");
    setOraRaduno("");
    setOraGara("");
    setPreRadunoLuogo("");
    setPreRadunoOra("");
    setConvocati([]);
    setNumeriMaglia({});
    setCapitanoId("");
    setViceCapitanoId("");
    setNote(
      "Si raccomanda di avvisare in caso di indisponibilità."
    );
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area Staff</p>
        <h2>⚽ Nuova convocazione</h2>
        <p>
          Compila i dati della gara e seleziona i
          giocatori convocati.
        </p>
      </div>

      <form
        className="convocazione-form"
        onSubmit={pubblicaConvocazione}
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
                  setCompetizione(event.target.value)
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
                    sede === "casa" ? "selected" : ""
                  }
                  onClick={() => setSede("casa")}
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
                  setAvversario(event.target.value)
                }
                placeholder="Esempio: PO Vittuone"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="data-gara">Data</label>
              <input
                id="data-gara"
                type="date"
                value={dataGara}
                onChange={(event) =>
                  setDataGara(event.target.value)
                }
                required
              />
            </div>

            <div className="partita-preview form-field-full">
              <span>Anteprima partita</span>
              <strong>{titoloPartita}</strong>
              <small>{competizione}</small>
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <h3>Campo e orari</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="campo">Campo</label>
              <input
                id="campo"
                type="text"
                value={campo}
                onChange={(event) =>
                  setCampo(event.target.value)
                }
                placeholder="Esempio: Oratorio Vittuone"
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
                  setIndirizzo(event.target.value)
                }
                placeholder="Esempio: Via Bixio 17, Vittuone"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="comune">Comune</label>
              <input
                id="comune"
                type="text"
                value={comune}
                onChange={(event) =>
                  setComune(event.target.value)
                }
                placeholder="Esempio: Vittuone"
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
                  setOraRaduno(event.target.value)
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
                  setOraGara(event.target.value)
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <h3>Pre-raduno facoltativo</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="pre-raduno-luogo">
                Luogo
              </label>
              <input
                id="pre-raduno-luogo"
                type="text"
                value={preRadunoLuogo}
                onChange={(event) =>
                  setPreRadunoLuogo(
                    event.target.value
                  )
                }
                placeholder="Esempio: Corbetta, via Repubblica"
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
              <p>Selezionati: {convocati.length}</p>
            </div>

            <button
              type="button"
              className="select-all-button"
              onClick={selezionaTutti}
            >
              {convocati.length === giocatori.length
                ? "Deseleziona tutti"
                : "Seleziona tutti"}
            </button>
          </div>

          {caricamentoGiocatori && (
            <p>Caricamento rosa...</p>
          )}

          {erroreGiocatori && (
            <p className="form-message form-message-error">
              Errore nel caricamento della rosa:{" "}
              {erroreGiocatori}
            </p>
          )}

          {!caricamentoGiocatori &&
            !erroreGiocatori &&
            giocatori.length === 0 && (
              <p>
                Nessun giocatore attivo presente.
              </p>
            )}

          {!caricamentoGiocatori &&
            !erroreGiocatori &&
            giocatori.length > 0 && (
              <div className="giocatori-checkbox-grid">
                {giocatori.map((giocatore) => {
                  const nomeCompleto =
                    `${giocatore.cognome} ${giocatore.nome}`;

                  return (
                    <label
                      key={giocatore.id}
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
                      <span>{nomeCompleto}</span>
                    </label>
                  );
                })}
              </div>
            )}
        </div>

        {giocatoriConvocati.length > 0 && (
          <div className="convocazione-form-section">
            <div className="dati-convocati-heading">
              <div>
                <h3>Dati riservati Staff</h3>
                <p>
                  Numero di maglia, capitano e vice
                  capitano non saranno visibili alle
                  famiglie.
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
                    key={giocatore.id}
                    className="dati-convocato-row"
                  >
                    <strong>
                      {giocatore.cognome}{" "}
                      {giocatore.nome}
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
                      onChange={(event) =>
                        cambiaNumeroMaglia(
                          giocatore.id,
                          event.target.value
                        )
                      }
                      aria-label={`Numero maglia di ${giocatore.cognome} ${giocatore.nome}`}
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
                      <span>Capitano</span>
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
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              rows="6"
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="Inserisci eventuali comunicazioni aggiuntive..."
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
            className="button button-primary staff-submit-button"
            type="submit"
            disabled={caricamento}
          >
            {caricamento
              ? "Pubblicazione in corso..."
              : "Pubblica convocazione"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default StaffConvocazioni;
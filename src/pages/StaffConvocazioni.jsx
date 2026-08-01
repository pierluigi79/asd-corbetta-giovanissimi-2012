import { useMemo, useState } from "react";

const giocatori = [
  "Begaj",
  "Bertolino",
  "Brunelli",
  "Fantauzzo",
  "Fuse",
  "Garritano",
  "Marcone",
  "Metushi",
  "Pessina",
  "Ratclif",
  "Re",
  "Rebella",
  "Salis",
  "Slanzi",
  "Stucchi",
  "Vanzaghi",
];

function StaffConvocazioni() {
  const [competizione, setCompetizione] = useState("Campionato");
  const [sede, setSede] = useState("casa");
  const [avversario, setAvversario] = useState("");
  const [dataGara, setDataGara] = useState("");
  const [campo, setCampo] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [oraRaduno, setOraRaduno] = useState("");
  const [oraGara, setOraGara] = useState("");
  const [preRadunoLuogo, setPreRadunoLuogo] = useState("");
  const [preRadunoOra, setPreRadunoOra] = useState("");
  const [convocati, setConvocati] = useState([]);
  const [note, setNote] = useState(
    "Si raccomanda di avvisare in caso di indisponibilità."
  );

  const titoloPartita = useMemo(() => {
    const nomeAvversario = avversario.trim() || "Avversario";

    return sede === "casa"
      ? `Corbetta - ${nomeAvversario}`
      : `${nomeAvversario} - Corbetta`;
  }, [avversario, sede]);

  function cambiaConvocato(nome) {
    setConvocati((precedenti) =>
      precedenti.includes(nome)
        ? precedenti.filter((giocatore) => giocatore !== nome)
        : [...precedenti, nome]
    );
  }

  function provaPubblicazione(event) {
    event.preventDefault();

    alert(
      `Convocazione pronta: ${titoloPartita}\nConvocati selezionati: ${convocati.length}`
    );
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area Staff</p>
        <h2>⚽ Nuova convocazione</h2>
        <p>
          Compila i dati della gara e seleziona i giocatori convocati.
        </p>
      </div>

      <form className="convocazione-form" onSubmit={provaPubblicazione}>
        <div className="convocazione-form-section">
          <h3>Dati della partita</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="competizione">Competizione</label>
              <select
                id="competizione"
                value={competizione}
                onChange={(event) => setCompetizione(event.target.value)}
              >
                <option>Campionato</option>
                <option>Torneo</option>
                <option>Amichevole</option>
              </select>
            </div>

            <div className="form-field">
              <span className="form-label">Dove si gioca?</span>

              <div className="sede-selector">
                <button
                  type="button"
                  className={sede === "casa" ? "selected" : ""}
                  onClick={() => setSede("casa")}
                >
                  In casa
                </button>

                <button
                  type="button"
                  className={sede === "trasferta" ? "selected" : ""}
                  onClick={() => setSede("trasferta")}
                >
                  In trasferta
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="avversario">Avversario</label>
              <input
                id="avversario"
                type="text"
                value={avversario}
                onChange={(event) => setAvversario(event.target.value)}
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
                onChange={(event) => setDataGara(event.target.value)}
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
                onChange={(event) => setCampo(event.target.value)}
                placeholder="Esempio: Oratorio Vittuone"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="indirizzo">Indirizzo</label>
              <input
                id="indirizzo"
                type="text"
                value={indirizzo}
                onChange={(event) => setIndirizzo(event.target.value)}
                placeholder="Esempio: Via Bixio 17, Vittuone"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ora-raduno">Ora raduno</label>
              <input
                id="ora-raduno"
                type="time"
                value={oraRaduno}
                onChange={(event) => setOraRaduno(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ora-gara">Ora partita</label>
              <input
                id="ora-gara"
                type="time"
                value={oraGara}
                onChange={(event) => setOraGara(event.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="convocazione-form-section">
          <h3>Pre-raduno facoltativo</h3>

          <div className="staff-form">
            <div className="form-field">
              <label htmlFor="pre-raduno-luogo">Luogo</label>
              <input
                id="pre-raduno-luogo"
                type="text"
                value={preRadunoLuogo}
                onChange={(event) => setPreRadunoLuogo(event.target.value)}
                placeholder="Esempio: Corbetta, via Repubblica"
              />
            </div>

            <div className="form-field">
              <label htmlFor="pre-raduno-ora">Ora</label>
              <input
                id="pre-raduno-ora"
                type="time"
                value={preRadunoOra}
                onChange={(event) => setPreRadunoOra(event.target.value)}
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
              onClick={() =>
                setConvocati(
                  convocati.length === giocatori.length ? [] : giocatori
                )
              }
            >
              {convocati.length === giocatori.length
                ? "Deseleziona tutti"
                : "Seleziona tutti"}
            </button>
          </div>

          <div className="giocatori-checkbox-grid">
            {giocatori.map((giocatore) => (
              <label key={giocatore} className="giocatore-checkbox">
                <input
                  type="checkbox"
                  checked={convocati.includes(giocatore)}
                  onChange={() => cambiaConvocato(giocatore)}
                />
                <span>{giocatore}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="convocazione-form-section">
          <div className="form-field">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              rows="6"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Inserisci eventuali comunicazioni aggiuntive..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button button-primary staff-submit-button"
            type="submit"
          >
            Pubblica convocazione
          </button>
        </div>
      </form>
    </section>
  );
}

export default StaffConvocazioni;
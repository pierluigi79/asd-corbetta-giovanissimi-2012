import { useState } from "react";
import { supabase } from "../lib/supabase";

function StaffAvvisi() {
  const [titolo, setTitolo] = useState("");
  const [testo, setTesto] = useState("");
  const [categoria, setCategoria] = useState("Comunicazione");
  const [priorita, setPriorita] = useState("normale");
  const [messaggio, setMessaggio] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  async function pubblica(event) {
    event.preventDefault();

    setMessaggio("");
    setErrore("");
    setCaricamento(true);

    const { error } = await supabase.from("avvisi").insert({
      titolo: titolo.trim(),
      testo: testo.trim(),
      categoria,
      priorita,
      autore: "Staff",
    });

    setCaricamento(false);

    if (error) {
      setErrore(error.message);
      return;
    }

    setMessaggio("Avviso pubblicato correttamente.");
    setTitolo("");
    setTesto("");
    setCategoria("Comunicazione");
    setPriorita("normale");
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area Staff</p>
        <h2>Nuovo avviso</h2>
        <p>Compila i campi e pubblica la comunicazione per le famiglie.</p>
      </div>

      <div className="staff-form-card">
        <form className="staff-form" onSubmit={pubblica}>
          <div className="form-field form-field-full">
            <label htmlFor="titolo">Titolo</label>
            <input
              id="titolo"
              type="text"
              value={titolo}
              onChange={(event) => setTitolo(event.target.value)}
              placeholder="Esempio: variazione orario allenamento"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              <option>Comunicazione</option>
              <option>Allenamento</option>
              <option>Partita</option>
              <option>Materiale</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="priorita">Priorità</label>
            <select
              id="priorita"
              value={priorita}
              onChange={(event) => setPriorita(event.target.value)}
            >
              <option value="normale">Normale</option>
              <option value="importante">Importante</option>
            </select>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="testo">Testo</label>
            <textarea
              id="testo"
              rows="7"
              value={testo}
              onChange={(event) => setTesto(event.target.value)}
              placeholder="Scrivi qui il contenuto dell'avviso..."
              required
            />
          </div>

          {errore && (
            <p className="form-message form-message-error">{errore}</p>
          )}

          {messaggio && (
            <p className="form-message form-message-success">{messaggio}</p>
          )}

          <div className="form-actions">
            <button
              className="button button-primary staff-submit-button"
              type="submit"
              disabled={caricamento}
            >
              {caricamento ? "Pubblicazione..." : "Pubblica avviso"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default StaffAvvisi;
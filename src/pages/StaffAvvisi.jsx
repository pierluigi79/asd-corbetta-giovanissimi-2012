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
  const [allegato, setAllegato] = useState(null);

async function pubblica(event) {
  event.preventDefault();

  setMessaggio("");
  setErrore("");
  setCaricamento(true);

  let allegatoUrl = null;
  let allegatoNome = null;

  if (allegato) {
    if (allegato.type !== "application/pdf") {
      setErrore("Puoi caricare solo file PDF.");
      setCaricamento(false);
      return;
    }

    const nomeFileSicuro = allegato.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-");

    const percorsoFile = `${Date.now()}-${nomeFileSicuro}`;

    const { error: erroreUpload } = await supabase.storage
      .from("documenti")
      .upload(percorsoFile, allegato);

    if (erroreUpload) {
      setErrore(
        `Errore nel caricamento del PDF: ${erroreUpload.message}`
      );
      setCaricamento(false);
      return;
    }

    const { data: datiUrl } = supabase.storage
      .from("documenti")
      .getPublicUrl(percorsoFile);

    allegatoUrl = datiUrl.publicUrl;
    allegatoNome = allegato.name;
  }

  const { error } = await supabase.from("avvisi").insert({
    titolo: titolo.trim(),
    testo: testo.trim(),
    categoria,
    priorita,
    autore: "Staff",
    allegato_url: allegatoUrl,
    allegato_nome: allegatoNome,
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
  setAllegato(null);
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
<div className="form-field form-field-full">
  <label htmlFor="allegato">Allegato PDF facoltativo</label>

  <input
    id="allegato"
    type="file"
    accept="application/pdf"
    onChange={(event) =>
      setAllegato(event.target.files?.[0] ?? null)
    }
  />

  {allegato && (
    <small>File selezionato: {allegato.name}</small>
  )}
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
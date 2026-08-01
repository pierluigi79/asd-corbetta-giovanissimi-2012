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
      titolo,
      testo,
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
        <h2>Nuovo Avviso</h2>
      </div>

      <form className="login-form" onSubmit={pubblica}>
        <label htmlFor="titolo">Titolo</label>
        <input
          id="titolo"
          type="text"
          value={titolo}
          onChange={(event) => setTitolo(event.target.value)}
          required
        />

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

        <label htmlFor="priorita">Priorità</label>
        <select
          id="priorita"
          value={priorita}
          onChange={(event) => setPriorita(event.target.value)}
        >
          <option value="normale">Normale</option>
          <option value="importante">Importante</option>
        </select>

        <label htmlFor="testo">Testo</label>
        <textarea
          id="testo"
          rows="6"
          value={testo}
          onChange={(event) => setTesto(event.target.value)}
          required
        />

        {errore && <p className="form-error">{errore}</p>}
        {messaggio && <p>{messaggio}</p>}

        <button className="button button-primary" type="submit">
          {caricamento ? "Pubblicazione..." : "Pubblica Avviso"}
        </button>
      </form>
    </section>
  );
}

export default StaffAvvisi;
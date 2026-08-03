import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function StaffRosa() {
  const [persone, setPersone] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaPersone() {
      const { data, error } = await supabase
        .from("persone")
        .select("id, cognome, nome, tipo_persona, attivo")
        .order("tipo_persona", { ascending: true })
        .order("cognome", { ascending: true })
        .order("nome", { ascending: true });

      if (error) {
        setErrore(error.message);
      } else {
        setPersone(data ?? []);
      }

      setCaricamento(false);
    }

    caricaPersone();
  }, []);

  function formattaTipo(tipo) {
    const etichette = {
      giocatore: "Giocatore",
      dirigente: "Dirigente",
      allenatore: "Allenatore",
      vice_allenatore: "Vice allenatore",
    };

    return etichette[tipo] ?? tipo;
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area Staff</p>
        <h2>👥 Rosa Squadra</h2>
        <p>
          Elenco delle persone collegate ai Giovanissimi 2012.
        </p>
      </div>

      {caricamento && <p>Caricamento rosa...</p>}

      {errore && (
        <p className="form-message form-message-error">
          Errore nel caricamento: {errore}
        </p>
      )}

      {!caricamento && !errore && persone.length === 0 && (
        <p>Nessuna persona presente.</p>
      )}

      {!caricamento && !errore && persone.length > 0 && (
        <div className="rosa-table-wrapper">
          <table className="rosa-table">
            <thead>
              <tr>
                <th>Cognome</th>
                <th>Nome</th>
                <th>Tipo persona</th>
                <th>Stato</th>
              </tr>
            </thead>

            <tbody>
              {persone.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.cognome}</td>
                  <td>{persona.nome}</td>
                  <td>{formattaTipo(persona.tipo_persona)}</td>
                  <td>
                    <span
                      className={
                        persona.attivo
                          ? "status-badge status-active"
                          : "status-badge status-inactive"
                      }
                    >
                      {persona.attivo ? "Attivo" : "Non attivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StaffRosa;
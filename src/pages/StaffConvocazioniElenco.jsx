import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function StaffConvocazioniElenco() {
  const [convocazioni, setConvocazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaConvocazioni() {
      setCaricamento(true);
      setErrore("");

      const { data, error } = await supabase
        .from("convocazioni")
        .select(
          `
          id,
          competizione,
          avversario,
          data_gara,
          ora_gara,
          ora_ritrovo,
          campo,
          comune,
          sede,
          pubblicata,
          updated_at,
          created_at
          `
        )
        .order("data_gara", { ascending: false })
        .order("ora_gara", { ascending: false });

      if (error) {
        setErrore(
          `Errore nel caricamento delle convocazioni: ${error.message}`
        );
        setConvocazioni([]);
      } else {
        setConvocazioni(data ?? []);
      }

      setCaricamento(false);
    }

    caricaConvocazioni();
  }, []);

  function formattaData(data) {
    if (!data) return "Data non disponibile";

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

  function titoloPartita(convocazione) {
    return convocazione.sede === "trasferta"
      ? `${convocazione.avversario} - Corbetta`
      : `Corbetta - ${convocazione.avversario}`;
  }

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Area Staff</p>
        <h2>Gestisci convocazioni</h2>
        <p>
          Consulta le convocazioni e accedi ai dati completi riservati
          allo Staff.
        </p>
      </div>

      <div className="staff-page-actions">
        <Link
          className="button button-primary"
          to="/staff/convocazioni"
        >
          + Nuova convocazione
        </Link>
      </div>

      {caricamento && <p>Caricamento convocazioni...</p>}

      {errore && (
        <p className="form-message form-message-error">
          {errore}
        </p>
      )}

      {!caricamento &&
        !errore &&
        convocazioni.length === 0 && (
          <div className="empty-state">
            <p>Non sono ancora presenti convocazioni.</p>
          </div>
        )}

      {!caricamento &&
        !errore &&
        convocazioni.length > 0 && (
          <div className="staff-convocazioni-list">
            {convocazioni.map((convocazione) => (
              <article
                key={convocazione.id}
                className="staff-convocazione-card"
              >
                <div className="staff-convocazione-card-top">
                  <div>
                    <p className="staff-convocazione-competizione">
                      {convocazione.competizione}
                    </p>

                    <h3>{titoloPartita(convocazione)}</h3>
                  </div>

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

                <div className="staff-convocazione-info">
                  <p>
                    <strong>Data:</strong>{" "}
                    {formattaData(convocazione.data_gara)}
                  </p>

                  <p>
                    <strong>Ora gara:</strong>{" "}
                    {formattaOra(convocazione.ora_gara)}
                  </p>

                  <p>
                    <strong>Ritrovo:</strong>{" "}
                    {formattaOra(convocazione.ora_ritrovo)}
                  </p>

                  <p>
                    <strong>Campo:</strong>{" "}
                    {convocazione.campo || "—"}
                  </p>

                  <p>
                    <strong>Comune:</strong>{" "}
                    {convocazione.comune || "—"}
                  </p>
                </div>

                <div className="staff-convocazione-actions">
                  <Link
                    className="button button-primary"
                    to={`/staff/convocazione/${convocazione.id}`}
                  >
                    Apri dettaglio Staff
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}

export default StaffConvocazioniElenco;
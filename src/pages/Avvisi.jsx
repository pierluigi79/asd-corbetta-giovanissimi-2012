import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Avvisi() {
  const [avvisi, setAvvisi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    async function caricaAvvisi() {
      const { data, error } = await supabase
        .from("avvisi")
        .select("*")
        .order("data_pubblicazione", { ascending: false });

      if (error) {
        setErrore(error.message);
      } else {
        setAvvisi(data ?? []);
      }

      setCaricamento(false);
    }

    caricaAvvisi();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <p className="page-kicker">Comunicazioni della squadra</p>
        <h2>Avvisi</h2>
        <p>Tutte le informazioni importanti per giocatori e famiglie.</p>
      </div>

      {caricamento && <p>Caricamento avvisi...</p>}

      {errore && (
        <p>
          Errore nel caricamento: <strong>{errore}</strong>
        </p>
      )}

      {!caricamento && !errore && avvisi.length === 0 && (
        <p>Nessun avviso pubblicato.</p>
      )}

      <div className="avvisi-list">
        {avvisi.map((avviso) => (
          <article
            key={avviso.id}
            className={`avviso-card ${
              avviso.priorita === "importante" ? "avviso-importante" : ""
            }`}
          >
            <div className="avviso-top">
              <span
                className={`avviso-badge ${
                  avviso.priorita !== "importante"
                    ? "avviso-badge-info"
                    : ""
                }`}
              >
                {avviso.priorita || avviso.categoria}
              </span>

              <time>
                {avviso.data_pubblicazione
                  ? new Date(avviso.data_pubblicazione).toLocaleDateString(
                      "it-IT"
                    )
                  : ""}
              </time>
            </div>

            <h3>{avviso.titolo}</h3>
            <p>{avviso.testo}</p>

            {avviso.allegato_url && (
              <p className="avviso-allegato">
                <a
                  href={avviso.allegato_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary"
                >
                  📄 {avviso.allegato_nome || "Apri allegato PDF"}
                </a>
              </p>
            )}

            {avviso.autore && (
              <p>
                <small>Pubblicato da {avviso.autore}</small>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Avvisi;
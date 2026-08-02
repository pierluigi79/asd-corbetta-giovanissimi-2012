import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const [sessione, setSessione] = useState(null);
  const [controlloInCorso, setControlloInCorso] = useState(true);

  useEffect(() => {
    async function controllaSessione() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSessione(session);
      setControlloInCorso(false);
    }

    controllaSessione();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      setSessione(session);
      setControlloInCorso(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (controlloInCorso) {
    return (
      <section>
        <p>Verifica accesso in corso...</p>
      </section>
    );
  }

  if (!sessione) {
    return <Navigate to="/login-staff" replace />;
  }

  return children;
}

export default ProtectedRoute;
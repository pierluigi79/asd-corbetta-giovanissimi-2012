import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Avvisi from "./pages/Avvisi";
import Convocazioni from "./pages/Convocazioni";
import Galleria from "./pages/Galleria";
import Contatti from "./pages/Contatti";
import Staff from "./pages/Staff";
import LoginStaff from "./pages/LoginStaff";
import StaffAvvisi from "./pages/StaffAvvisi";
import StaffConvocazioni from "./pages/StaffConvocazioni";
import StaffRosa from "./pages/StaffRosa";
import RecuperaPassword from "./pages/RecuperaPassword";
import AggiornaPassword from "./pages/AggiornaPassword";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <Navbar />

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/avvisi" element={<Avvisi />} />
          <Route path="/convocazioni" element={<Convocazioni />} />
          <Route path="/galleria" element={<Galleria />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/login-staff" element={<LoginStaff />} />
          <Route path="/staff/rosa" element={<ProtectedRoute> <StaffRosa /> </ProtectedRoute>
  }
/>

          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Staff />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/avvisi"
            element={
              <ProtectedRoute>
                <StaffAvvisi />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/convocazioni"
            element={
              <ProtectedRoute>
                <StaffConvocazioni />
              </ProtectedRoute>
            }
          />
<Route
  path="/recupera-password"
  element={<RecuperaPassword />}
/>

<Route
  path="/aggiorna-password"
  element={<AggiornaPassword />}
/>

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

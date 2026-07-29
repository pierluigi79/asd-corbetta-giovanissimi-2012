import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Avvisi from "./pages/Avvisi";
import Convocazioni from "./pages/Convocazioni";
import Galleria from "./pages/Galleria";
import Contatti from "./pages/Contatti";

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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

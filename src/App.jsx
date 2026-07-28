import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Avvisi from "./pages/Avvisi";

function App() {
  return (
    <div>
      <Header />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/avvisi" element={<Avvisi />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

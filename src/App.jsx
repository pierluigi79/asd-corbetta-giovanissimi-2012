import "./App.css";

import Home from "./pages/Home";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>⚽ ASD Calcio Corbetta</h1>
        <p>Giovanissimi 2012</p>
      </header>

      <nav className="navbar">
        <a href="#">Home</a>
        <a href="#">Avvisi</a>
        <a href="#">Convocazioni</a>
        <a href="#">Galleria</a>
        <a href="#">Contatti</a>
      </nav>

     <main className="container">
       <Home />
      </main>

      <footer className="footer">
        © ASD Calcio Corbetta - Giovanissimi 2012
      </footer>
    </div>
  );
}

export default App;
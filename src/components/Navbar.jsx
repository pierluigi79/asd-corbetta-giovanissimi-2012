import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/avvisi">Avvisi</NavLink>
      <NavLink to="/convocazioni">Convocazioni</NavLink>
      <NavLink to="/galleria">Galleria</NavLink>
      <NavLink to="/contatti">Contatti</NavLink>
    </nav>
  );
}

export default Navbar;
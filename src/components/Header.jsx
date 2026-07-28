import logo from "../assets/logo.png";

function Header() {
  return (
    <header className="site-header">
      <img
        src={logo}
        alt="Logo ASD Calcio Corbetta"
        className="site-logo"
      />

      <div>
        <h1>ASD Calcio Corbetta</h1>
        <p>Giovanissimi 2012</p>
      </div>
    </header>
  );
}

export default Header;
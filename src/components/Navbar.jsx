import { useState } from "react";
import { PHONE } from "../data/products";

export default function Navbar({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="nav-logo" onClick={() => navigate("home")}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">AeroShop</span>
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button
            className={`nav-link ${page === "home" ? "active" : ""}`}
            onClick={() => { navigate("home"); setMenuOpen(false); }}
          >
            Home
          </button>
          <button
            className="nav-link nav-call"
            onClick={() => window.open(`tel:${PHONE}`)}
          >
            📞 Call Us
          </button>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

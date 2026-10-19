import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useContent } from "../lib/contentContext";

const LINKS = [
  ["/", "Home"],
  ["/achievements", "Achievements"],
  ["/vision", "Vision"],
  ["/news", "News & Gallery"],
];

function Navbar() {
  const { settings } = useContent();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">{settings.name}</span>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <nav id="site-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Main" onClick={() => setOpen(false)}>
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className="nav-link">
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="btn btn-yellow btn-sm">Get in touch</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

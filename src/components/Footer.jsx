import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { createElement } from "react";
import { useContent } from "../lib/contentContext";

const SOCIALS = [
  ["facebook", "Facebook", FaFacebookF],
  ["x", "X", FaXTwitter],
  ["instagram", "Instagram", FaInstagram],
  ["youtube", "YouTube", FaYoutube],
];

function Footer() {
  const { settings } = useContent();
  const links = SOCIALS.filter(([key]) => settings.socials[key]);
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-name">{settings.name}</span>
          </span>
          <p>{settings.slogan} · Aspirant Governor, {settings.county}</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/achievements">Achievements</Link>
          <Link to="/vision">Vision</Link>
          <Link to="/news">News & Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        {links.length > 0 && (
          <div className="socials">
            {links.map(([key, label, icon]) => (
              <a key={key} href={settings.socials[key]} target="_blank" rel="noopener noreferrer" aria-label={label}>
                {createElement(icon)}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="container footer-legal">
        &copy; {year} {settings.name}. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

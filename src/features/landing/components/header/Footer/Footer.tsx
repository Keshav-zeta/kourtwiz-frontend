import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#clubs">Clubs</a>
          <a href="#contact">Contact</a>
          <a href="/home">ZETA</a>
        </div>

        <p className="footer-copy">&copy; {new Date().getFullYear()} Kourtwiz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

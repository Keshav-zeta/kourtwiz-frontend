import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const handleNavigation = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Pickleball Logo"  style={{ width: "50px", height: "auto" }}/>
      </div>
      <nav className="nav-links">
      <a href="#home" onClick={(e) => handleNavigation(e, "home")}>HOME</a>
        <a href="#about" onClick={(e) => handleNavigation(e, "about")}>ABOUT</a>
        <a href="#clubs" onClick={(e) => handleNavigation(e, "clubs")}>CLUBS</a>
        <a href="#pricing" onClick={(e) => handleNavigation(e, "pricing")}>PRICING</a>
        <a href="#services" onClick={(e) => handleNavigation(e, "services")}>SERVICES</a>
        
        <button className="contact-btn" onClick={() => navigate("")}>
          CONTACT
        </button>
      </nav>
    </header>
  );
};

export default Header;

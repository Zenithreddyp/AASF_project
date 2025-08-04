import React, { useState } from "react";
import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { validateToken } from "../components/authCheck"; // Assuming this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const logoimages = [
  '/logo.png',
  '/logoname.png',
]

const Navbar = () => {
  const [menu, setMenu] = useState("home"); // Changed to setMenu for consistency
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // New state for search bar animation

  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation

  const handleMenuClick = async (path) => {
    if (path === "profile") {
      const isloggedin = await validateToken();

      if (isloggedin) {
        setMenu("profile");
        navigate("/profile");
      } else {
        alert("Please log in to access your profile.");
        navigate("/login");
      }
    } else {
      setMenu(path); // You can still keep this for internal logic if needed
      navigate(`/${path}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchExpanded(false); // Collapse search bar after search
      setSearchTerm(""); // Clear search term
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // If expanding, focus on the input field after a short delay
      setTimeout(() => {
        document.querySelector('.search-form input').focus();
      }, 100);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
      <img
        src={logoimages[0]}
        alt="logo"
      />
      </div>
      <div className="logoname">
      <img
        src={logoimages[1]}
        alt="Zedova"
      />
      </div>

      <ul className="navbarlinks">
        <li
          onClick={() => handleMenuClick("")}
          className={location.pathname === "/" ? "active" : ""} 
        >
          Home
        </li>

        <li
          onClick={() => handleMenuClick("cart")}
          className={location.pathname === "/cart" ? "active" : ""} 
        >
          Cart
        </li>
        <li
          onClick={() => handleMenuClick("orders")}
          className={location.pathname === "/orders" ? "active" : ""} 
        >
          Orders
        </li>
        <li
          onClick={() => handleMenuClick("profile")}
          className={location.pathname === "/profile" ? "active" : ""} 
        >
          Profile
        </li>
      </ul>

      <form
        className={`search-form ${isSearchExpanded ? "expanded" : ""}`}
        onSubmit={handleSearchSubmit}
      >
        <input
          type="search"
          placeholder="Search here ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearchIconClick} />
      </form>
    </div>
  );
};

export default Navbar;
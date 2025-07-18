import React, { useState } from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../components/authCheck";

const Navbar = () => {
  const [menu, setmenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleMenuClick = async (path) => {
    if (path === "profile") {
      const isloggedin = await validateToken();

      if (isloggedin) {
        setmenu("profile");
        navigate("/profile");
      } else {
        alert("Please log in to access your profile.");
        navigate("/login");
      }
    } else {
      setmenu(path);
      navigate(`/${path}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <video
          className="videomini"
          src="/Vedio.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        Zedova
      </div>

      <ul className="navbarlinks">
        <li
          onClick={() => handleMenuClick("")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </li>

        <li
          onClick={() => handleMenuClick("cart")}
          className={menu === "cart" ? "active" : ""}
        >
          Cart
        </li>
        <li
          onClick={() => handleMenuClick("orders")}
          className={menu === "orders" ? "active" : ""}
        >
          Orders
        </li>
        <li
          onClick={() => handleMenuClick("profile")}
          className={menu === "profile" ? "active" : ""}
        >
          Profile
        </li>
      </ul>

      <div className="searchbar">
        <input
          type="text"
          placeholder="start searching"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyPress}
        />
      </div>
    </div>
  );
};

export default Navbar;

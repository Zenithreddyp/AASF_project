import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';


const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1];


    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleMenuClick = (path) => {

        navigate(`/${path}`);
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
                <li onClick={() => handleMenuClick("")} className={currentPath === "" ? "active" : ""}>Home</li>
                <li onClick={() => handleMenuClick("cart")} className={currentPath === "cart" ? "active" : ""}>Cart</li>
                <li onClick={() => handleMenuClick("orders")} className={currentPath === "orders" ? "active" : ""}>Orders</li>
                <li onClick={() => handleMenuClick("login")} className={currentPath === "login" ? "active" : ""}>Profile</li>

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

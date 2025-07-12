import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menu, setmenu] = useState("home");
    const navigate = useNavigate();

    const handleMenuClick = (path) => {
        setmenu(path);
        navigate(`/${path}`);
    };

    return (
        <>
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
                    <li onClick={() => handleMenuClick("home")} className={menu === "home" ? "active" : ""}>Home</li>
                    <li onClick={() => handleMenuClick("cart")} className={menu === "cart" ? "active" : ""}>Cart</li>
                    <li onClick={() => handleMenuClick("orders")} className={menu === "orders" ? "active" : ""}>Orders</li>
                    <li onClick={() => handleMenuClick("profile")} className={menu === "profile" ? "active" : ""}>Profile</li>
                </ul>

                <div className="searchbar">
                    <input type="text" placeholder="search here" />
                </div>
            </div>
        </>
    );
};

export default Navbar;

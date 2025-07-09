// Menubar.jsx
import React from 'react';
import '../styles/Menubar.css';
import { useNavigate } from 'react-router-dom';

const Menubar = () => {
    const navigate = useNavigate();

    const categories = [
        "Mobiles",
        "Laptops",
        "Shoes",
        "Stationary",
        "Watches",
        "Tablets",
        "Headphones",
        "Smart TVs",
    ];

    return (
        <div className="menubar">

            {categories.map((item) => (
                <div
                    key={item}
                    className="menu-item"
                    onClick={() => navigate(`/${item.toLowerCase()}`)}
                >
                    {item}
                </div>
            ))}
        </div>
    );
};

export default Menubar;

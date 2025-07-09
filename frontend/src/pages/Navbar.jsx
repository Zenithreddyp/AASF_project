import React from 'react'
import '../styles/Navbar.css'
import { useState } from 'react'

const Navbar = () => {
    const [menu, setmenu] = useState("home");
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
                    <li onClick={() => setmenu("home")} className={menu === "home" ? "active" : ""} > Home</li >
                    <li onClick={() => setmenu("cart")} className={menu === "cart" ? "active" : ""} >Cart</li>
                    <li onClick={() => setmenu("orders")} className={menu === "orders" ? "active" : ""} >Orders</li>
                    <li onClick={() => setmenu("profile")} className={menu === "profile" ? "active" : ""} > Profile</li >
                    <li onClick={() => setmenu("about")} className={menu === "about" ? "active" : ""}> About Us</li >
                </ul >


                <div className="searchbar">
                    <input type="text" placeholder="search here" />

                </div>
            </div >

        </>
    )
}

export default Navbar

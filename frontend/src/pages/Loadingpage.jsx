// src/components/VideoPopup.jsx
import React, { useEffect, useState } from "react";
import "./VideoPopup.css";

const Loadingpage = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem("videoShown");
        if (!alreadyShown) {
            setShow(true);
            sessionStorage.setItem("videoShown", "true");
        }
    }, []);

    const closePopup = () => {
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="video-popup-overlay">
            <div className="video-popup">
                <video autoPlay muted controls className="popup-video">
                    <source src="/loading(1).mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <button className="close-btn" onClick={closePopup}>✖</button>
            </div>
        </div>
    );
};

export default Loadingpage;

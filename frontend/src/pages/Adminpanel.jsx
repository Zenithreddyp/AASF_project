import "../styles/Adminpanel.css";
import React from 'react';

const Adminpanel = () => {
    return (
        <>
            <div className="adminzedova">
                zedova
            </div>

            <div className="leftright">
                <div className="left">
                    <button className="admin-btn add">Add</button>
                    <button className="admin-btn delete">Delete</button>
                    <button className="admin-btn orders">Orders</button>
                </div>
                <div className="right">
                    content here
                </div>
            </div>
        </>
    );
};

export default Adminpanel;

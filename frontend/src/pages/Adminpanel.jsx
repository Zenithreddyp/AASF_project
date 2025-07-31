import "../styles/Adminpanel.css";
import React, { useState } from 'react';

const Adminpanel = () => {
    const [activePanel, setActivePanel] = useState("add"); // default to "add"

    return (
        <>
            <div className="adminzedova">
                zedova
            </div>

            <div className="leftright">
                <div className="left">
                    <button className="admin-btn add" onClick={() => setActivePanel("add")}>Add Items</button>
                    <button className="admin-btn delete" onClick={() => setActivePanel("delete")}>Dlete Items</button>
                    <button className="admin-btn orders" onClick={() => setActivePanel("orders")}>Orders</button>
                </div>

                <div className="right">

                    {activePanel === "add" && (
                        <div className="form-container">
                            <div className="upload-section">
                                <label htmlFor="upload-image" className="upload-label">
                                    Upload image
                                </label>
                                <input type="file" id="upload-image" />
                            </div>

                            <div className="form-field">
                                <label>Product name</label>
                                <input type="text" placeholder="Type here" />
                            </div>

                            <div className="form-field">
                                <label>Product description</label>
                                <textarea placeholder="Write content here" />
                            </div>

                            <div className="form-bottom">
                                <select>
                                    <option value="iphone">iphone</option>
                                    <option value="oneplus">oneplus</option>
                                    <option value="samsung">samsung</option>
                                </select>

                                <input type="text" placeholder="$25" className="price-input" />
                                <button className="add-btn">ADD</button>
                            </div>
                        </div>
                    )}


                    {activePanel === "delete" && (
                        <div className="delete-panel">

                        </div>
                    )}


                    {activePanel === "orders" && (
                        <div>
                            <h2>Orders will be displayed here.</h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Adminpanel;

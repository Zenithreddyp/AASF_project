import React, { useState } from 'react';
import '../styles/profilepage.css';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        phone: '98785748484',
        pincode: '500072',
        village: 'kpkp',
        city: 'hyderabad'
    });
    const handlelogout = () => {
        navigate("/login")
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setShowModal(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info">
                    <img src="./header2.png" alt="" className="profilepic" />
                    <div>
                        <h2>zedova</h2>
                        <p>zedova@example.com</p>
                    </div>
                </div>
                <button className="edit-btn" onClick={() => setShowModal(true)}>Edit Profile</button>
                {showModal && (
                    <div className="inline-popup">
                        <h3>Edit Profile Info</h3>
                        <form onSubmit={handleSubmit} className="edit-form">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="village"
                                placeholder="Village"
                                value={formData.village}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>

            <div className="profile-body">
                <div className="recent-orders">
                    <h3>Recent Orders</h3>
                    <div className="orders-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="order-card">
                                <img src="/header1.png" alt="Product" className="order-img" />
                                <p>samsung s23</p>
                                <span>Delivered</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-links">
                    <h4>Quick Links</h4>
                    <button className="wishlist">Whishlist</button>
                    <button onClick={handlelogout} className="logout-btn">Logout</button>
                    {/* zenith */}
                </div>
            </div>




        </div>
    );
};

export default ProfilePage;

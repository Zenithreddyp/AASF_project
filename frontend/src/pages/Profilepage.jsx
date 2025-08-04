import React, { useEffect, useState } from 'react';
import '../styles/profilepage.css';
import { useNavigate } from 'react-router-dom';
import { fetchuserAllAddress } from '../api/useraddress';

const ProfilePage = () => {
    const navigate = useNavigate();

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState([]);

    const [formData, setFormData] = useState({
        name: 'doni',
        username: 'doni'
    });

    const handleLogout = () => {
        navigate('/logout');
    };

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        console.log('Profile Updated:', formData);
        setShowProfileModal(false);
    };

    const fetchAddresses = async () => {
        try {
            const data = await fetchuserAllAddress();
            setAddresses(data);
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info">
                    <img src="./header2.png" alt="Profile" className="profilepic" />
                    <div>
                        <h2>{formData.name}</h2>
                        <p>{formData.username}</p>
                    </div>
                </div>
                <button className="edit-btn" onClick={() => setShowProfileModal(true)}>
                    Edit Profile
                </button>
            </div>

            <div className="profile-body">
                <div className="recent-orders">
                    <h3>Recent Orders</h3>
                    <div className="orders-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="order-card">
                                <img src="/header1.png" alt="Product" className="order-img" />
                                <p>Samsung S23</p>
                                <span>Delivered</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-links">
                    <h4>Quick Links</h4>
                    <button className="wishlist">Wishlist</button>
                    <button onClick={() => setShowAddressModal(true)}>
                        Manage Addresses
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {showProfileModal && (
                <div className="inline-popup">
                    <h3>Edit Profile Info</h3>
                    <form onSubmit={handleProfileSubmit} className="edit-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleProfileChange}
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleProfileChange}
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setShowProfileModal(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Address View Modal */}
            {showAddressModal && (
                <div className="inline-popup">
                    <h3>Your Addresses</h3>
                    {addresses.length === 0 ? (
                        <p>No saved addresses</p>
                    ) : (
                        <ul className="address-list">
                            {addresses.map((addr, index) => (
                                <li key={index} className="address-item">
                                    <strong>{addr.full_name}</strong><br />
                                    {addr.address}, {addr.city}, {addr.state} - {addr.postal_code}<br />
                                    Phone: {addr.phone_number}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import '../styles/profilepage.css';
import { useNavigate } from 'react-router-dom';
import { fetchuserAllAddress, addNewAddress } from '../api/useraddress';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const [formData, setFormData] = useState({
        name: 'doni',
        username: 'doni',
    });

    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState({
        house_no: '',
        city: '',
        pincode: '',
        landmark: '',
        state: '',
    });

    const handleLogout = () => {
        navigate('/logout');
    };

    const handleProfileChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        console.log('Profile Updated:', formData);
        setShowProfileModal(false);
    };

    const handleAddressChange = (e) => {
        setAddressForm({
            ...addressForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            await addNewAddress(addressForm);
            const data = await fetchuserAllAddress();
            setAddresses(data);
            setAddressForm({
                house_no: '',
                city: '',
                pincode: '',
                landmark: '',
                state: '',
            });
            setShowAddressModal(false);
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await fetchuserAllAddress();
                setAddresses(data);
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };
        fetchAddresses();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info">
                    <img src="./header2.png" alt="" className="profilepic" />
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
                                <p>samsung s23</p>
                                <span>Delivered</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-links">
                    <h4>Quick Links</h4>
                    <button className="wishlist">Wishlist</button>
                    <button onClick={() => setShowAddressModal(true)}>Edit Address</button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>

                <div className="saved-addresses">
                    <h4>Saved Addresses</h4>
                    {addresses.length === 0 ? (
                        <p>No saved addresses.</p>
                    ) : (
                        <ul>
                            {addresses.map((addr, index) => (
                                <li key={index}>
                                    {addr.house_no}, {addr.city}, {addr.state}, {addr.pincode}{' '}
                                    {addr.landmark && `(${addr.landmark})`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Profile Edit Popup */}
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

            {/* Address Edit Popup */}
            {showAddressModal && (
                <div className="inline-popup">
                    <h3>Add/Edit Address</h3>
                    <form onSubmit={handleAddressSubmit} className="edit-form">
                        <input
                            type="text"
                            name="house_no"
                            placeholder="House No"
                            value={addressForm.house_no}
                            onChange={handleAddressChange}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={addressForm.city}
                            onChange={handleAddressChange}
                            required
                        />
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={addressForm.pincode}
                            onChange={handleAddressChange}
                            required
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={addressForm.state}
                            onChange={handleAddressChange}
                            required
                        />
                        <input
                            type="text"
                            name="landmark"
                            placeholder="Landmark (optional)"
                            value={addressForm.landmark}
                            onChange={handleAddressChange}
                        />
                        <button type="submit">Save Address</button>
                        <button type="button" onClick={() => setShowAddressModal(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

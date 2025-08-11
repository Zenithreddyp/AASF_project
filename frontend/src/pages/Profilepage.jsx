import React, { useEffect, useState } from "react";
import "../styles/profilepage.css";
import { useNavigate } from "react-router-dom";
import { fetchuserAllAddress } from "../api/useraddress";
import Navbar from "./Navbar";
import Orders from "./Orderspage";


const ProfilePage = () => {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [formData, setFormData] = useState({
    name: "doni",
    username: "doni",
  });

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", formData);
    setShowProfileModal(false);
  };

  const fetchAddresses = async () => {
    try {
      const data = await fetchuserAllAddress();
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
    <Navbar/>
   
      <div className="profile-container">
        <div className="profile-header">
          <div className="user-info">
            <img src="./header2.png" alt="Profile" className="profilepic" />
            <div>
              <h2>{formData.name}</h2>
              <p>{formData.username}</p>
            </div>
          </div>
          <button
            className="edit-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Edit Profile
          </button>
        </div>

        <div className="profile-body">
       

          <div className="quick-links">
           
           <button className="button1">botton1</button>
           
<button className="button2">botton2</button>
           

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
                  <label key={index} className="address-item">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr.id}
                      className="address-radio"
                      // You can add logic for selecting address here
                      onChange={() => console.log("Selected:", addr.id)}
                    />
                    <div className="address-details">
                      <strong>{addr.full_name}</strong>
                      <br />
                      {addr.address}, {addr.city}, {addr.state} -{" "}
                      {addr.postal_code}
                      <br />
                      Phone: {addr.phone_number}
                      <div className="address-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="delete">delete</button>
                      </div>
                    </div>
                  </label>
                ))}
              </ul>
            )}
            <div className="button-wrapper">
              <button type="button" onClick={() => setShowAddressModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
       <Orders/>
    </>
  );
};

export default ProfilePage;

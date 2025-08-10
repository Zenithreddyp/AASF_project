import React, { useEffect, useState } from "react";
import "../styles/profilepage.css";
import { useNavigate } from "react-router-dom";
import { fetchuserAllAddress } from "../api/useraddress";
import { fetchusername } from "../api/profile";
import { retriveallorders } from "../api/cart";
import Navbar from "./Navbar";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [formData, setFormData] = useState({
  //   name: "doni",
  //   username: "doni",
  // });

  const [formData, setFormData] = useState({
    username: "",
    email: "example@gmail.com",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchusername(); // should return { username, email }
        setFormData({
          username: data.username || "",
          email: "example@gmail.com",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await retriveallorders();
        console.log(data);
        const formatedOrders = data.map((order) => {
          const addressParts = order.shipping_address?.split(",") || [];

          return {
            ...order,
            date: new Date(order.bought_at).toLocaleString(),
            total: order.total_price,
            address: {
              fullname: addressParts[0] || "",
              phone: addressParts[1] || "",
              address: addressParts[2] || "",
              city: addressParts[3] || "",
              state: addressParts[4] || "",
              pincode: addressParts[5] || "",
            },
            items: order.items || [],
          };
        });

        setOrders(formatedOrders.reverse());
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      }
      setLoading(false);
    };

    const fetchAddresses = async () => {
      try {
        const data = await fetchuserAllAddress();
        setAddresses(data);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    fetchDetails();
    fetchOrders();
    fetchAddresses
  }, []);

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


  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="user-info">
            <img src="./header2.png" alt="Profile" className="profilepic" />
            <div>
              <h2>{formData.username}</h2>
              <p>{formData.email}</p>
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
          <div className="recent-orders">
            <h3>Recent Orders</h3>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <div className="orders-grid">
                {orders.slice(0, 4).map((order, i) => (
                  <div key={order.id || i} className="order-card">
                    <img
                      src={order.items[0]?.image || "/placeholder.png"}
                      alt={order.items[0]?.name || "Product"}
                      className="order-img"
                    />
                    <p>{order.items[0]?.name || "Unknown Product"}</p>
                    <span>{order.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent orders</p>
            )}
          </div>

          <div className="quick-links">
            <button className="button1">button1</button>
            <button className="button2">button2</button>
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
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleProfileChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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
                        <button className="delete">Delete</button>
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
    </>
  );
};

export default ProfilePage;
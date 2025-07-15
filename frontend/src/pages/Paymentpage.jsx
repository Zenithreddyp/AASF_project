import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Paymentpage.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state;


    if (!data) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                ❌ No products selected. Please go back and add items to your cart.
                <br />
                <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>⬅️ Go Back</button>
            </div>
        );
    }

    const items = Array.isArray(data) ? data : [data];

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [fullname, setFullname] = useState('');
    const [pincode, setpincode] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const totalPrice = items.reduce((acc, item) => {
        const cost = typeof item.cost === 'string'
            ? Number(item.cost.replace(/[₹,]/g, ''))
            : Number(item.cost || 0);
        return acc + cost * (item.quantity || 1);
    }, 0);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('userAddresses')) || [];
        setSavedAddresses(stored);

        if (stored.length === 0) {
            setShowForm(true);
        }
    }, []);

    const selectAddress = (index) => {
        const addr = savedAddresses[index];
        setSelectedIndex(index);
        setFullname(addr.fullname);
        setPhone(addr.phone);
        setAddress(addr.address);
        setCity(addr.city);
        setState(addr.state);
        setpincode(addr.pincode);
        setShowForm(false);
    };

    const deleteAddress = (index) => {
        const updated = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updated);
        localStorage.setItem('userAddresses', JSON.stringify(updated));
        setSelectedIndex(null);
    };

    const handlePayment = () => {
        if (!fullname || !phone || !address || !city || !state) {
            alert("Please fill all the fields.");
            return;
        }

        if (selectedIndex === null) {
            const newAddress = { fullname, phone, address, city, state, pincode };
            const updated = [...savedAddresses, newAddress];
            setSavedAddresses(updated);
            localStorage.setItem('userAddresses', JSON.stringify(updated));
        }

        setSubmitted(true);
        alert("Payment successful!");
        localStorage.removeItem('cart');
    };

    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

    return (
        <div className="paymentpage">
            <div className="payment-container">
                <h2>Complete Your Payment</h2>

                {savedAddresses.length > 0 && (
                    <div className="saved-addresses">
                        <h3>Select Saved Address</h3>
                        {savedAddresses.map((addr, index) => (
                            <div
                                key={index}
                                className={`address-card ${selectedIndex === index ? 'selected' : ''}`}
                            >
                                <div className="address-card-top">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={selectedIndex === index}
                                        onChange={() => selectAddress(index)}
                                    />
                                    <div>
                                        <p><strong>{addr.fullname}</strong> - {addr.phone}</p>
                                        <p>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                    </div>
                                </div>

                                <button className="delete-btn" onClick={() => deleteAddress(index)}>
                                    🗑 Delete
                                </button>
                            </div>

                        ))}
                        <button
                            className="new-address-btn"
                            onClick={() => {
                                setSelectedIndex(null);
                                setShowForm(true);
                                setFullname('');
                                setPhone('');
                                setAddress('');
                                setCity('');
                                setState('');
                                setpincode('');
                            }}
                        >
                            + New Address
                        </button>
                    </div>
                )}

                <div className="payment-form-wrapper">
                    {showForm && (
                        <div className="address-section">
                            <label>Full Name:</label>
                            <input
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                placeholder="Enter your full name"
                            />

                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                            />

                            <label>Address Line:</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full delivery address"
                                rows={3}
                            />

                            <label>City:</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                            />

                            <label>State:</label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                            />

                            <label>Pincode:</label>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setpincode(e.target.value)}
                                placeholder="Pincode"
                            />
                        </div>
                    )}

                    <div className="form-section">


                        <div className="amount-section">
                            <p>Total Amount: <strong>₹{totalPrice}</strong></p>
                        </div>

                        <button
                            onClick={() => {
                                if (!fullname || !phone || !address || !city || !state) {
                                    alert("Please fill all the fields.");
                                    return;
                                }

                                if (selectedIndex === null) {
                                    const newAddress = { fullname, phone, address, city, state, pincode };
                                    const updated = [...savedAddresses, newAddress];
                                    setSavedAddresses(updated);
                                    localStorage.setItem('userAddresses', JSON.stringify(updated));
                                }

                                navigate('/upi', {
                                    state: { amount: totalPrice }
                                });
                            }}
                        >
                            Proceed to Payment
                        </button>


                        {submitted && <p className="success-msg">✅ Payment Completed Successfully!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

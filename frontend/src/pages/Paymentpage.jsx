import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Paymentpage.css';

const PaymentPage = () => {
    const location = useLocation();
    const data = location.state;
    const items = Array.isArray(data) ? data : [data];

    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [upi, setUpi] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const totalPrice = items.reduce((acc, item) => acc + item.cost * (item.quantity || 1), 0);

    const handlePayment = () => {
        if (!fullname || !phone || !address || !city || !state || !upi) {
            alert("Please fill all the fields.");
            return;
        }

        setSubmitted(true);
        alert("Payment successful!");
        localStorage.removeItem('cart');
    };

    return (
        <div className="paymentpage">

            <div className="payment-container">
                <h2>Complete Your Payment</h2>
                <div className="payment-form-wrapper">
                    {/* Left Side – Address Form */}
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
                    </div>


                    <div className="form-section">
                        <label>UPI ID:</label>
                        <input
                            type="text"
                            value={upi}
                            onChange={(e) => setUpi(e.target.value)}
                            placeholder="e.g., yourname@upi"
                        />

                        <div className="amount-section">
                            <p>Total Amount: <strong>₹{totalPrice}</strong></p>
                        </div>

                        <button onClick={handlePayment}>Confirm Payment</button>

                        {submitted && <p className="success-msg">✅ Payment Completed Successfully!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;



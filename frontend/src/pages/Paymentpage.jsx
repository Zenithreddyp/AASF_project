import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Paymentpage.css';

const PaymentPage = () => {
    const location = useLocation();
    const data = location.state;
    const items = Array.isArray(data) ? data : [data];

    const [address, setAddress] = useState('');
    const [upi, setUpi] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const totalPrice = items.reduce((acc, item) => acc + item.cost * (item.quantity || 1), 0);

    const handlePayment = () => {
        if (!address || !upi) {
            alert("Please fill all the fields.");
            return;
        }
        setSubmitted(true);

        alert("Payment successful!");

        localStorage.removeItem('cart');
    };

    return (
        <div className="payment-container">
            <h2>Complete Your Payment</h2>

            <div className="form-section">
                <label>Delivery Address:</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    rows={4}
                />

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
    );
};

export default PaymentPage;


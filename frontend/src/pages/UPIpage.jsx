import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UPIpage.css';
import Navbar from './Navbar';

const UPIPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const amount = location.state?.amount;
    const items = location.state?.items || [];
    const address = location.state?.address;

    useEffect(() => {
        if (!amount || !address || items.length === 0) {
            navigate('/payment');
        }
    }, [amount, address, items, navigate]);

    const handlePaymentSuccess = () => {
        alert("✅ UPI Payment Successful!");

        const newOrder = {
            items,
            total: amount,
            address,
            date: new Date().toLocaleString(),
        };

        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        localStorage.removeItem('cart');
        navigate('/orders');
    };

    return (
        <>
            <Navbar />
            <div className="upi-page">
                <h2>UPI Payment</h2>
                <div className="payment-summary">
                    <h3>Order Summary</h3>
                    <p><strong>Total Amount:</strong> ₹{amount}</p>
                    <p><strong>Shipping Address:</strong></p>
                    <div className="upi-address">
                        <p>{address.fullname}, {address.phone}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                    </div>
                </div>

                <div className="upi-section">
                    <p>Scan the QR or use your UPI app to pay</p>
                    <img src="/qr-placeholder.png" alt="QR Code" className="qr-code" />
                    <p>UPI ID: <strong>shop@upi</strong></p>
                    <button className="pay-btn" onClick={handlePaymentSuccess}>
                        ✅ Mark as Paid
                    </button>
                </div>
            </div>
        </>
    );
};

export default UPIPage;

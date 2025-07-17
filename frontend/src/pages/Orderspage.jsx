import React, { useEffect, useState } from 'react';
import '../styles/Orderspage.css';
import Navbar from './Navbar';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(storedOrders.reverse());
    }, []);

    return (
        <>
            <Navbar />
            <div className="orders-page">
                <h2>Your Orders</h2>
                {orders.length === 0 ? (
                    <p className="no-orders">🛒 You have no completed orders.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div className="order-header">
                                <p><strong>Order Date:</strong> {order.date}</p>
                                <p><strong>Total:</strong> ₹{order.total}</p>
                            </div>

                            <div className="order-address">
                                <p><strong>Delivered To:</strong></p>
                                <p>{order.address.fullname}, {order.address.phone}</p>
                                <p>{order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <img src={item.img} alt={item.name} className="order-img" />
                                        <div>
                                            <p className="order-item-name">{item.name}</p>
                                            <p>Price: {item.cost}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Subtotal: ₹{Number(item.cost.replace(/[₹,]/g, '')) * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Orders;

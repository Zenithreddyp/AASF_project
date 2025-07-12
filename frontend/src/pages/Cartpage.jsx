import React, { useEffect, useState } from 'react';
import '../styles/CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const deleteItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateQuantity = (id, change) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                return { ...item, quantity: newQty < 1 ? 1 : newQty };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    const getTotalQuantity = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };


    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.cost.replace(/[₹,]/g, ''));
            return total + price * item.quantity;
        }, 0);
    };

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p className="empty-cart">Your CartPage is empty.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.img} alt={item.name} className="cart-image" />
                            <div className="cart-info">
                                <h3>{item.name}</h3>
                                <p>Price: {item.cost}</p>
                                <p>Subtotal: ₹{Number(item.cost.replace(/[₹,]/g, '')) * item.quantity}</p>
                                <div className="cart-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
                                    <button onClick={() => deleteItem(item.id)} className="delete-btn">🗑️ Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <h3 className="total-price">Total: ₹{getTotalPrice()}</h3>


                    <button
                        className="order-btn"
                        onClick={() => navigate('/payment', { state: cartItems[0] })}
                    >
                        Proceed to Buy ({getTotalQuantity()} items)

                    </button>
                </>
            )}
        </div>
    );
};

export default CartPage;

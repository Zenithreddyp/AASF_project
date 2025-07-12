import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';

const ProductPage = () => {
    const location = useLocation();
    const item = location.state;
    const navigate = useNavigate();

    if (!item) {
        return <div>No product data found. Please go back and select a product.</div>;
    }

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(product => product.id === item.id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart!');
    };

    const buyNow = () => {
        navigate('/payment', { state: item });
    };

    return (
        <div className="product-container">
            <div className="product-image-section">
                <img src={item.img} alt={item.name} className="product-image" />
            </div>
            <div className="product-details-section">
                <h2 className="product-name">{item.name}</h2>
                <p className="product-cost">{item.cost}</p>
                <p className="product-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="product-buttons">
                    <button onClick={buyNow}>Buy Now</button>
                    <button onClick={addToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;

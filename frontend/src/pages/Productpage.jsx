import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';

import { addtocart } from "../api/cart";

const ProductPage = () => {
    const location = useLocation();
    const item = location.state;
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const images = item?.images || [];


    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [images]);


    if (!item) {
        return <div>No product data found. Please go back and select a product.</div>;
    }

    // const addToCart = () => {
    //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //     const existingIndex = cart.findIndex(product => product.id === item.id);

    //     if (existingIndex !== -1) {
    //         cart[existingIndex].quantity += 1;
    //     } else {
    //         cart.push({ ...item, quantity: 1 });
    //     }

    //     localStorage.setItem('cart', JSON.stringify(cart));
    //     alert('Item added to cart!');
    // };


    const handleaddToCart = async() => {
        await addtocart(item);
    };





    
    const buyNow = () => {
        navigate('/payment', { state: item });
    };


    const currentImage = images.length > 0 ? images[currentIndex].image : '/fallback.png';

    return (
        <div className="product-container">
            <div className="product-image-section">
                <img
                    src={currentImage}
                    alt={item.name}
                />
            </div>
            <div className="product-details-section">
                <h2 className="product-name">{item.name}</h2>
                <p className="product-cost">{item.cost || `₹${item.price}`}</p>
                <p className="product-desc">{item.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                <div className="product-buttons">
                    <button onClick={buyNow}>Buy Now</button>
                    <button onClick={handleaddToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;

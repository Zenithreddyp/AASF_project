import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProductPage.css';

const ProductPage = () => {
    const location = useLocation();
    const item = location.state;

    return (
        <div className="product-container">
            <div className="product-image-section">
                <img src={item.img} alt={item.name} className="product-image" />
            </div>
            <div className="product-details-section">
                <h2 className="product-name">{item.name}</h2>
                <p className="product-cost">{item.cost}</p>
                <p className="product-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>
    );
};

export default ProductPage;

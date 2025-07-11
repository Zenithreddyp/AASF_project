
import React from 'react';
import '../styles/Recoms.css';
import { useNavigate } from 'react-router-dom';

const Recoms = () => {
    const navigate = useNavigate();

    const items = [
        {
            id: 1,
            name: 'iPhone 14 Pro Max',
            cost: '₹1,29,999',
            img: './header1.png',
        },
        {
            id: 2,
            name: 'Samsung Galaxy S23 Ultra',
            cost: '₹1,24,499',
            img: './header2.png',
        },
        {
            id: 3,
            name: 'OnePlus 11R',
            cost: '₹45,999',
            img: './header1.png',
        },
        {
            id: 4,
            name: 'Realme GT Neo 3',
            cost: '₹36,999',
            img: './header2.png',
        },
        {
            id: 5,
            name: 'Nothing Phone (2)',
            cost: '₹44,999',
            img: './header2.png',
        },
        {
            id: 6,
            name: 'Google Pixel 7A',
            cost: '₹41,999',
            img: './header1.png',
        },
        {
            id: 7,
            name: 'Redmi Note 13 Pro+',
            cost: '₹31,999',
            img: './header2.png',
        },
        {
            id: 8,
            name: 'Motorola Edge 40',
            cost: '₹29,999',
            img: './header1.png',
        },
    ];

    const goToProduct = (item) => {
        navigate('/product', { state: item });
    };

    return (
        <>
            <div className="recom">based on your profile</div>
            <div className="recom-container">
                {items.map((item, index) => (
                    <div className="recom-item" key={index} onClick={() => goToProduct(item)}>
                        <div className="recom-inner">
                            <div className="recom-image">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="recom-details">
                                <div className="recom-name">{item.name}</div>
                                <div className="recom-cost">{item.cost}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Recoms;


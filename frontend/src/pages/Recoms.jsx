
import React from 'react';
import '../styles/Recoms.css';
import { useNavigate } from 'react-router-dom';

const Recoms = () => {
    const navigate = useNavigate();

    const items = [
        {
            name: 'Model A',
            cost: '₹19,999',
            img: './header1.png',
        },
        {
            name: 'Model B',
            cost: '₹24,499',
            img: './header2.png',
        },
        {
            name: 'Model C',
            cost: '₹15,999',
            img: './header1.png',
        },
        {
            name: 'Model D',
            cost: '₹29,999',
            img: './header2.png',
        },
        {
            name: 'Model e',
            cost: '₹29,999',
            img: './header2.png',
        },
        {
            name: 'Model F',
            cost: '₹29,999',
            img: './header1.png',
        },
        {
            name: 'Model G',
            cost: '₹29,999',
            img: './header2.png',
        },
        {
            name: 'Model H',
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


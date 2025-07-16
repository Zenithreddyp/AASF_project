import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Searchpage.css';


const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('query')?.toLowerCase() || "";


    const items = [
        {
            id: 1,
            name: 'iPhone 14 Pro Max',
            cost: '₹1,29,999',
            img: '/header1.png',
        },
        {
            id: 2,
            name: 'Samsung Galaxy S23 Ultra',
            cost: '₹1,24,499',
            img: '/header2.png',
        },
        {
            id: 3,
            name: 'OnePlus 11R',
            cost: '₹45,999',
            img: '/header1.png',
        },
        {
            id: 4,
            name: 'Realme GT Neo 3',
            cost: '₹36,999',
            img: '/header2.png',
        },
        {
            id: 5,
            name: 'Nothing Phone (2)',
            cost: '₹44,999',
            img: '/header2.png',
        },
        {
            id: 6,
            name: 'Google Pixel 7A',
            cost: '₹41,999',
            img: '/header1.png',
        },
        {
            id: 7,
            name: 'Redmi Note 13 Pro+',
            cost: '₹31,999',
            img: '/header2.png',
        },
        {
            id: 8,
            name: 'Motorola Edge 40',
            cost: '₹29,999',
            img: '/header1.png',
        },
    ];

    const [results, setResults] = useState([]);

    useEffect(() => {
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm)
        );
        setResults(filtered);
    }, [searchTerm]);
    

    const goToProduct = (item) => {
        navigate('/product', { state: item });
    };

    return (
        <div className="search-page">
            <div className="search-container">
                <h2>Search results for "{searchTerm}"</h2>
                <div className="search-results">
                    {results.length > 0 ? (
                        results.map((item, index) => (
                            <div key={index} className="search-card" onClick={() => goToProduct(item)}>
                                <div className="search-card-inner">
                                    <div className="search-card-image">
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <div className="search-card-details">
                                        <div className="search-card-name">{item.name}</div>
                                        <div className="search-card-cost">{item.cost}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No matching products found.</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default SearchPage;

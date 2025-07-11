import React from 'react';
import '../styles/Recoms.css';

const Recoms = () => {
    const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

    return (
        <>
            <div className="recom">
                based on your profile
            </div>
            <div className="recom-container">
                {items.map((item, index) => (
                    <div className="recom-item" key={index}>
                        {item}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Recoms;

import React from 'react';
import '../styles/Error404Page.css';

const Error404Page = () => {
  return (
    <div className="error-404-container">
      <div className="error-404-content">      
        <h1>404 Not Found</h1>
        <p className="description-line">Lost in the vast web,</p>
        <p className="description-line">Where you sought, there's only void—</p>
        <p className="description-line">Nothingness awaits.</p>
        <a href="/" className="go-home-button">
          Go to Zedova Home
        </a>
      </div>
    </div>
  );
};

export default Error404Page;
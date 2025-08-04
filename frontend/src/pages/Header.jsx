import React, { useEffect, useState } from 'react';
import '../styles/Header.css';

const images = [
  '/model1zedova.png',
  '/model2zedova.png',
];

const Header = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setFade(false), 2500);
    const slideTimeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 3000);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(slideTimeout);
    };
  }, [current]);

  return (
    <div className="header">
      <img
        src={images[current]}
        alt="header"
        className={`header-img ${fade ? 'fade-in' : 'fade-out'}`}
      />
      <div className="header-overlay-text"> Explore The Ultimate</div>
    </div>
  );
}

export default Header;

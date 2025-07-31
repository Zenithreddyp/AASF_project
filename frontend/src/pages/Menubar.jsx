
import React from "react";
import "../styles/Menubar.css";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Mobiles", image: "/images/phone.png" },
    { name: "Laptops", image: "/images/laptop.png" },
    { name: "Shoes", image: "/images/shoes.png" },
    { name: "Watches", image: "/images/watch.png" },
    { name: "Tablets", image: "/images/tablet.png" },
    { name: "Headphones", image: "/images/heaphones.png" },
    { name: "Smart TVs", image: "/images/tv.png" },
  ];
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase().replace(' ', '+')}`);
  };
  return (
    <>
      <div className="menubar">
        {categories.map((item) => (
          <div
            key={item.name}
            className="menu-item"
            onClick={() =>
              navigate(`/search?category=${item.name.toLowerCase().replace(/\s/g, "+")}`)
            }

          >
            <span>{item.name}</span>
            <img src={item.image} alt={item.name} className="menu-item-image" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Menubar;

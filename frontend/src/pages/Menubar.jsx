
import React from "react";
import "../styles/Menubar.css";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "ELectronics", image: "/images/electronics.png" },
    { name: "Clothing", image: "/images/clothing.png" },
    { name: "Appliances", image: "/images/fridge.png" },
    { name: "Daily Needs", image: "/images/bottle.png" },
    { name: "Cosmetics", image: "/images/cosmetics.png" },
    { name: "Furniture", image: "/images/sofa.png" },
    { name: "Groceries", image: "/images/grocery.png" },
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

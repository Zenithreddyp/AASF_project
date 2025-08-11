 import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styles/Wishlist.css";
import { addtocart } from "../api/cart";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(storedWishlist);
  }, []);

  const handleAddToCart = async (item) => {
    await addtocart(item);
    alert(`${item.name} added to cart!`);
  };

  const handleDelete = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="wishlist-empty">
          <h2>Your wishlist is empty ❤️</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        {wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-item">
            <img src={item.images?.[0]?.image || "/fallback.png"} alt={item.name} />
            <div className="wishlist-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <div className="wishlist-actions">
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Wishlist;

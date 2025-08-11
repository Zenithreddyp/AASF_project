import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { fetchWishlist, removeWishlistItem, moveWishlistItemToCart } from "../api/wishlist";
import "../styles/Wishlist.css";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchWishlist();
    const wishlist = Array.isArray(data) ? data[0] : null;
    const formatted = wishlist?.items?.map((it) => ({
      id: it.id,
      productId: it.product.id,
      name: it.product.name,
      price: parseFloat(it.product.price),
      img: it.product.images?.[0]?.image,
    })) || [];
    setItems(formatted);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id) => {
    const res = await removeWishlistItem(id);
    if (res.status === 200 || res.status === 204) {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const handleMoveToCart = async (productId, wishlistItemId) => {
    await moveWishlistItemToCart(productId);
    // remove locally from wishlist
    setItems((prev) => prev.filter((x) => x.id !== wishlistItemId));
    alert("Moved to cart");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <img src="/loading.gif" alt="Loading..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        {items.length === 0 ? (
          <p className="empty-wishlist">Your Wishlist is empty.</p>
        ) : (
          items.map((it) => (
            <div className="wishlist-item" key={it.id}>
              <img src={it.img} alt={it.name} className="wishlist-image" />
              <div className="wishlist-info">
                <h3>{it.name}</h3>
                <p>Price: ₹{it.price}</p>
                <div className="wishlist-actions">
                  <button onClick={() => handleMoveToCart(it.productId, it.id)}>Move to Cart</button>
                  <button onClick={() => handleRemove(it.id)} className="delete-btn">Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Wishlist;



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ProductPage.css";
import Navbar from "./Navbar";

import { dispCart, addtocart, singleprodCart } from "../api/cart";
import { fetchProductbyid } from "../api/product";
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  // const location = useLocation();
  // const item = location.state;
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await fetchProductbyid(id);
        setItem(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchItem();
  }, [id]);

  const images = item?.images || [];

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [images]);

  if (!item) {
    return (
      <div>No product data found. Please go back and select a product.</div>
    );
  }

  // const addToCart = () => {
  //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
  //     const existingIndex = cart.findIndex(product => product.id === item.id);

  //     if (existingIndex !== -1) {
  //         cart[existingIndex].quantity += 1;
  //     } else {
  //         cart.push({ ...item, quantity: 1 });
  //     }

  //     localStorage.setItem('cart', JSON.stringify(cart));
  //     alert('Item added to cart!');
  // };

  const handleaddToCart = async () => {
    await addtocart(item);
  };

  const buyNow = async () => {
    await singleprodCart(item);

    const data = await dispCart();
    const cart = data[0];

    const formattedCart = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.product.name,
      prod_id: item.product.id,
      cost: parseFloat(item.product.price),
      img: item.product.images[0]?.image, // use the first image
    }));
    setCartItems(formattedCart);

    navigate("/payment", {
      state: { from: "product", items: formattedCart },
    });
  };

  const currentImage =
    images.length > 0 ? images[currentIndex].image : "/fallback.png";

  return (
    <>
      <Navbar />
      <div className="product-container">
        <div className="product-image-section">
          <img src={currentImage} alt={item.name} className="product-image" />
        </div>
        <div className="product-details-section">
          <h2 className="product-name">{item.name}</h2>
          <p className="product-cost">{item.cost || `₹${item.price}`}</p>
          <p className="product-desc">
            {item.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
          </p>
          <div className="product-buttons">
            <button onClick={buyNow}>Buy Now</button>
            <button onClick={handleaddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;

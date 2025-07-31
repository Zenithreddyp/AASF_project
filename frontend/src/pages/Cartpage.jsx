import React, { useEffect, useState } from "react";
import "../styles/CartPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import { dispCart, removeItem, updateQuant } from "../api/cart";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // setCartItems(storedCart);
    const fetchCart = async () => {
      const data = await dispCart();
      console.log("Cart response from backend:", data);

      const cart = data[0];

      if (!cart?.items) {
        console.error("Cart has no items");
        return;
      }

      const formattedCart = cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        name: item.product.name,
        prod_id: item.product.id,
        cost: parseFloat(item.product.price),
        img: item.product.images[0]?.image, // use the first image
      }));

      setCartItems(formattedCart);
    };

    fetchCart();
  }, []);

  const deleteItem = async (id) => {
    // const updatedCart = cartItems.filter((item) => item.id !== id);
    // setCartItems(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
    try {
      const res = await removeItem(id);

      if (res.status === 200 || res.status === 204) {
        const Updatedcart = cartItems.filter((item) => item.id !== id);
        setCartItems(Updatedcart);
      }
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const updateQuantity = async (id, newquantity) => {
    // const updatedCart = cartItems.map((item) => {
    //   if (item.id === id) {
    //     const newQty = item.quantity + change;
    //     return { ...item, quantity: newQty < 1 ? 1 : newQty };
    //   }
    //   return item;
    // });
    // setCartItems(updatedCart);
    // localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (newquantity <= 0) {
      alert("Quantity cannot be zero");
      return;
    }

    try {
      const res = await updateQuant(id, newquantity);
      if (res.status === 200) {
        const updatedCart = cartItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newquantity };
          }
          return item;
        });
        setCartItems(updatedCart);
      } else {
        console.error("Update failed:", res);
      }
    } catch (error) {
      console.error("Updating failed", error);
    }
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your CartPage is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-image" />
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Price: {item.cost}</p>
                  <p>Subtotal: ₹{(item.cost || 0) * item.quantity}</p>
                  <div className="cart-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <h3 className="total-price">Total: ₹{getTotalPrice()}</h3>

            <button
              className="order-btn"
              onClick={() =>
                navigate("/payment", {
                  state: { from: "cart", items: cartItems },
                })
              }
            >
              Proceed to Buy ({getTotalQuantity()} items)
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;

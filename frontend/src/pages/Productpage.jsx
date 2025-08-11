import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Productpage.css";
import Navbar from "./Navbar";
import { dispCart, addtocart, singleprodCart } from "../api/cart";
import { addToWishlist } from "../api/wishlist";
import { fetchProductbyid } from "../api/product";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await fetchProductbyid(id);
        setItem(data);
        setLoading(false);

        // Check if product is already in wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setIsWishlisted(wishlist.some((prod) => prod.id === data.id));
      } catch (error) {
        console.error("Failed to fetch product", error);
        setLoading(false);
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
      img: item.product.images[0]?.image,
    }));
    setCartItems(formattedCart);
    navigate("/payment", {
      state: { from: "product", items: formattedCart },
    });
  };

const toggleWishlist = () => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exists = wishlist.some((prod) => prod.id === item.id);

  if (exists) {
    wishlist = wishlist.filter((prod) => prod.id !== item.id);
    setIsWishlisted(false);
    alert("Removed from wishlist");
  } else {
    wishlist.push(item);
    setIsWishlisted(true);
    alert("Added to wishlist");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};


  const currentImage =
    images.length > 0 ? images[currentIndex].image : "/fallback.png";

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

  if (!item) {
    return <div>No product data found. Please go back and select a product.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="product-container">
        <div className="product-image-section">
          <img src={currentImage} alt={item.name} className="product-image" />
        </div>
        <div className="product-details-section">
          <h2 className="product-name">
            {item.name}
            <span
              onClick={toggleWishlist}
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                color: isWishlisted ? "red" : "grey",
                fontSize: "54px",
              }}
            >
              ♥
            </span>
          </h2>
          <p className="product-cost">{item.cost || `₹${item.price}`}</p>
          <p className="product-desc">
            {item.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
          </p>
          <div className="product-buttons">
            <button onClick={buyNow}>Buy Now</button>
            <button onClick={handleaddToCart}>Add to Cart</button>
            <button onClick={() => addToWishlist(item.id)}>Add to Wishlist</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;

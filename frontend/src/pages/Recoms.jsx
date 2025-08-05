import React, { useState, useEffect } from "react";
import "../styles/Recoms.css";
import { useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../api/product";

const Recoms = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem("recomProducts");

    if (cachedData) {
      setItems(JSON.parse(cachedData));
      setLoading(false);
    }

    fetchAllProducts()
      .then((data) => {
        setItems(data);
        localStorage.setItem("recomProducts", JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setError("Failed to load recommendations");
        setLoading(false);
      });
  }, []);

  const goToProduct = (item) => {
    navigate(`/product/${item.id}`);
  };

  if (loading) {
    return <div className="loading">
      <img src="/loading.gif" alt="Loading..." />
    </div>
  }

  if (error) {
    return <div className="recom">Error: {error}</div>;
  }

  return (
    <>
      <div className="recom">Based on your profile</div>
      <div className="singlerecom">
        <img className="basicimage" src="/header1.png" alt="" />
        <img className="basicimage" src="/header1.png" alt="" />

        <img className="basicimage" src="/header1.png" alt="" />
        <img className="basicimage" src="/header1.png" alt="" />
      </div>
      <p className="newlyadded">newly added</p>
      <div className="recom-container">
        {items.map((item, index) => (
          <div
            className="recom-item"
            key={index}
            onClick={() => goToProduct(item)}
          >
            <div className="recom-inner">
              <div className="recom-image">
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].image
                      : "/fallback.png"
                  }
                  alt={item.name}
                />
              </div>
              <div className="recom-details">
                <div className="recom-name">{item.name}</div>
                <div className="recom-cost">₹{item.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Recoms;




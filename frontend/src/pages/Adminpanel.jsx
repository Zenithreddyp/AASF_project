import "../styles/Adminpanel.css";
import React, { useState } from "react";

const logoimages = ["/logo.png", "/logoname.png"];

const Adminpanel = () => {
  const [activePanel, setActivePanel] = useState("add"); // default to "add"

  const [items, setItems] = useState([
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      cost: "₹1,29,999",
      img: "./header1.png",
    },
    {
      id: 2,
      name: "Samsung Galaxy S23 Ultra",
      cost: "₹1,24,499",
      img: "./header2.png",
    },
    {
      id: 3,
      name: "OnePlus 11R",
      cost: "₹45,999",
      img: "./header1.png",
    },
    {
      id: 4,
      name: "Realme GT Neo 3",
      cost: "₹36,999",
      img: "./header2.png",
    },
    {
      id: 5,
      name: "Nothing Phone (2)",
      cost: "₹44,999",
      img: "./header2.png",
    },
    {
      id: 6,
      name: "Google Pixel 7A",
      cost: "₹41,999",
      img: "./header1.png",
    },
    {
      id: 7,
      name: "Redmi Note 13 Pro+",
      cost: "₹31,999",
      img: "./header2.png",
    },
    {
      id: 8,
      name: "Motorola Edge 40",
      cost: "₹29,999",
      img: "./header1.png",
    },
  ]);

  const handleDelete = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  return (
    <>
      <div className="navbar">
        <button className="adminhome">
          <div className="logo">
            <img src={logoimages[0]} alt="logo" />
          </div>
        </button>
        <div className="logoname">
          <img src={logoimages[1]} alt="Zedova" />
        </div>
      </div>
      <div className="leftright">
        <div className="left">
          <button
            className="admin-btn add"
            onClick={() => setActivePanel("add")}
          >
            Add Items
          </button>
          <button
            className="admin-btn delete"
            onClick={() => setActivePanel("delete")}
          >
            Delete Items
          </button>
          <button
            className="admin-btn orders"
            onClick={() => setActivePanel("orders")}
          >
            Orders
          </button>
        </div>

        <div className="right">
          {activePanel === "add" && (
            <div className="form-container">
              <h2>🛒 Add New Product</h2>
              <form
                action="http://127.0.0.1:8000/prod/products/add/special/pass_zenith"
                method="POST"
                encType="multipart/form-data"
              >
                <div className="form-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Product name"
                  />
                </div>

                <div className="form-field">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    required
                    placeholder="Product description"
                  ></textarea>
                </div>

                <div className="form-field">
                  <label>Price:</label>
                  <input
                    type="text"
                    name="price"
                    required
                    placeholder="₹25,000"
                  />
                </div>

                <div className="form-field">
                  <label>Stock:</label>
                  <input type="number" name="stock" required placeholder="10" />
                </div>

                <div className="form-field">
                  <label>Category:</label>
                  <input
                    type="text"
                    name="category"
                    required
                    placeholder="Category"
                  />
                </div>

                <div className="form-field">
                  <label>Brand:</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    placeholder="Brand name"
                  />
                </div>

                <div className="form-field">
                  <label>Rating:</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    required
                    placeholder="4.5"
                  />
                </div>

                <div className="form-field">
                  <label>Product Images:</label>
                  <input type="file" name="uploaded_images" multiple />
                </div>

                <div className="form-bottom">
                  <button type="submit" className="add">
                    Submit Product
                  </button>
                </div>
              </form>
            </div>
          )}

          {activePanel === "delete" && (
            <div className="delete-panel">
              <h2>Delete Items</h2>
              <div className="delete-items-container">
                {items.map((item) => (
                  <div key={item.id} className="delete-item-box">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="delete-img"
                    />
                    <div className="delete-details">
                      <p>{item.name}</p>
                      <p>{item.cost}</p>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p>No items available.</p>}
              </div>
            </div>
          )}

          {activePanel === "orders" && (
            <div>
              <h2>Orders will be displayed here.</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Adminpanel;

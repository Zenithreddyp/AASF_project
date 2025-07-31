import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Paymentpage.css";
import Navbar from "./Navbar";

import { fetchuserAllAddress, addNewAddress } from "../api/useraddress";
import { placeOrder, removetempcart } from "../api/cart";

const PaymentPage = () => {
  const location = useLocation();
  const frompage = location.state?.from;
  const navigate = useNavigate();
  const data = location.state?.items||[];

  if (!data) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        ❌ No products selected. Please go back and add items to your cart.
        <br />
        <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
          ⬅️ Go Back
        </button>
      </div>
    );
  }

  const items = Array.isArray(data) ? data : [data];

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [fullname, setFullname] = useState("");
  const [pincode, setpincode] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // const [upi, setUpi] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [cartRemoved, setCartRemoved] = useState(false);

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const totalPrice = items.reduce((acc, item) => {
    console.log("Item:", item); // Log full item object
    console.log("Cost:", item?.cost);
    return acc + (Number(item.cost) || 0) * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    // const stored = JSON.parse(localStorage.getItem('userAddresses')) || [];
    // setSavedAddresses(stored);

    // if (stored.length === 0) {
    //     setShowForm(true);
    // }
    const fetchalladdress = async () => {
      try {
        const data = await fetchuserAllAddress();
        const transformed = data.map((addr) => ({
          fullname: addr.full_name,
          phone: addr.phone_number,
          address: addr.address,
          city: addr.city,
          state: addr.state,
          pincode: addr.postal_code,
        }));
        setSavedAddresses(transformed);
        if (data.length === 0) setShowForm(true);
      } catch (error) {
        console.error("Failed fettching addresss", error);
      }
    };

    fetchalladdress();
  }, []);

  const selectAddress = (index) => {
    const addr = savedAddresses[index];
    setSelectedIndex(index);
    setFullname(addr.fullname);
    setPhone(addr.phone);
    setAddress(addr.address);
    setCity(addr.city);
    setState(addr.state);
    setpincode(addr.pincode);
    setShowForm(false);
  };

  //  start of removing start     very important

  // useEffect(() => {
  //   const isReload =
  //     performance.getEntriesByType("navigation")[0]?.type === "reload";

  //   const cleanupTempCart = () => {
  //     if (frompage === "product" && !paymentCompleted && !isReload) {
  //       removetempcart();
  //     }
  //   };
  //   const handlePageHide = (event) => {
  //     if (!event.persisted && !isReload) {
  //       navigator.sendBeacon("/cart/delete/temp/cart/");
  //     }
  //   };

  //   window.addEventListener("pagehide", handlePageHide);

  //   return () => {
  //     window.removeEventListener("pagehide", handlePageHide);
  //     if (!isReload) {
  //       cleanupTempCart(); 
  //     }
  //   };

  // }, [frompage, paymentCompleted]);

  //  end of removing start
  const deleteAddress = (index) => {
    const updated = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setSelectedIndex(null);
  };

  const handlePayment = async () => {
    const missingFields = [];

    if (!fullname) missingFields.push("Full Name");
    if (!phone) missingFields.push("Phone Number");
    if (!address) missingFields.push("Address");
    if (!city) missingFields.push("City");
    if (!state) missingFields.push("State");
    if (!pincode) missingFields.push("Pin Code");

    if (missingFields.length > 0) {
      alert("Please fill the following field(s):\n" + missingFields.join("\n"));
      return;
    }
    let res = false;
    if (selectedIndex === null) {
      const newAddress = { fullname, phone, address, city, state, pincode };
      const updated = [...savedAddresses, newAddress];
      setSavedAddresses(updated);
      res = await addNewAddress(newAddress);
    } else {
      res = true; // Address already selected
    }

    if (res) {
      alert("Payment successful!");
      setPaymentCompleted(true);
      localStorage.removeItem("cart");
      setSubmitted(true);

      //add mark as orderd
      try {
        await placeOrder({
          full_name: fullname,
          phone_number: phone,
          address: address,
          city: city,
          state: state,
          postal_code: "100000", // or use the actual postal code if you have it
        });
        console.log("Order placed");
      } catch (error) {
        console.error("Error placing order:", error.message);
      }
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  return (
    <>
      <Navbar />
      <div className="paymentpage">
        <div className="payment-container">
          <h2>Complete Your Payment</h2>

          {savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <h3>Select Saved Address</h3>
              {savedAddresses.map((addr, index) => (
                <div
                  key={index}
                  className={`address-card ${
                    selectedIndex === index ? "selected" : ""
                  }`}
                >
                  <div className="address-card-top">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedIndex === index}
                      onChange={() => selectAddress(index)}
                    />
                    <div>
                      <p>
                        <strong>{addr.fullname}</strong> - {addr.phone}
                      </p>
                      <p>
                        {addr.address}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteAddress(index)}
                  >
                    🗑 Delete
                  </button>
                </div>
              ))}
              <button
                className="new-address-btn"
                onClick={() => {
                  setSelectedIndex(null);
                  setShowForm(true);
                  setFullname("");
                  setPhone("");
                  setAddress("");
                  setCity("");
                  setState("");
                  setpincode("");
                }}
              >
                + New Address
              </button>
            </div>
          )}

          <div className="payment-form-wrapper">
            {showForm && (
              <div className="address-section">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your full name"
                />

                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />

                <label>Address Line:</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  rows={3}
                />

                <label>City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />

                <label>State:</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />

                <label>Pincode:</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setpincode(e.target.value)}
                  placeholder="Pincode"
                />
              </div>
            )}

            <div className="form-section">
              {/* <label>UPI ID:</label>
            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="e.g., yourname@upi"
            /> */}
              <div className="amount-section">
                <p>
                  Total Amount: <strong>₹{totalPrice}</strong>
                </p>
              </div>
              <button onClick={handlePayment}>Confirm Payment</button>{" "}
              {/* still need to add few from donii */}
              {submitted && (
                <p className="success-msg">
                  ✅ Payment Completed Successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;

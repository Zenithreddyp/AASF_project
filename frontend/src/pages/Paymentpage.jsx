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
  const data = location.state?.items || [];

  if (!data || data.length === 0) {
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

  const [submitted, setSubmitted] = useState(false);

  const [cartRemoved, setCartRemoved] = useState(false);

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const totalPrice = parseFloat(
    items
      .reduce((acc, item) => {
        // console.log("Item:", item); // Log full item object
        // console.log("Cost:", item?.cost);
        return acc + (Number(item.cost) || 0) * (item.quantity || 1);
      }, 0)
      .toFixed(2)
  );

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
        // else if (selectedIndex === null && transformed.length > 0) {
        //   selectAddress(0);
        // }
      } catch (error) {
        console.error("Failed fetching addresses", error);
        setShowForm(true);
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
    if (updated.length === 0) setShowForm(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
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
    let addressSaveSuccess = false;

    if (selectedIndex === null) {
      const newAddress = {
        fullname,
        phone,
        address,
        city,
        state,
        pincode,
      };

      const res = await addNewAddress(newAddress);

      if (res) {
        const updated = [...savedAddresses, res];
        setSavedAddresses(updated);
        setSelectedIndex(savedAddresses.length); // ✅ Optionally select the new address
        addressSaveSuccess = true;
      } else {
        alert("Failed to save new address.");
        return;
      }
    } else {
      addressSaveSuccess = true;
    }
    // if (res) {
    //   setSavedAddresses((prev) => [...prev, newAddress]);
    //   addressSaveSuccess = true;
    // } else {
    //   alert("Failed to save new address.");
    //   return;
    // }
    if (!addressSaveSuccess) {
      return;
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // IMPORTANT: In a real-world scenario, you would first create an order
    // on your backend with Razorpay and get the order_id.
    // For this demonstration, we'll proceed directly with the payment window.
    const options = {
      key: "rzp_test_XgdFHDeUlG5ENZ",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Acme Corp",
      description: "Purchase from E-commerce Store",
      image: "https://example.com/your_logo",
      handler: async function (response) {
        const orderItemsForBackend = items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          price: Number(item.cost) || 0,
        }));

        try {
          const shippingAddress = {
            full_name: fullname,
            phone_number: phone,
            address,
            city,
            state,
            postal_code: pincode,
            total_price: totalPrice,
            items: orderItemsForBackend,
          };

          const razorpayDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          await placeOrder(shippingAddress, razorpayDetails);

          console.log("Order placed successfully on backend!");
          setSubmitted(true);
          localStorage.removeItem("cart");
        } catch (error) {
          console.error("Error placing order:", error);
          alert(
            "Payment successful, but there was an error processing your order. Please contact support."
          );
        }
      },
      prefill: {
        name: fullname,
        email: "customer@example.com",
        contact: phone,
      },
      notes: {
        address: `${address}, ${city}, ${state} - ${pincode}`,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed: " + response.error.description);
      console.error("Razorpay Error:", response.error);
    });

    rzp1.open();
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
              <div className="amount-section">
                <p>
                  Total Amount: <strong>₹{totalPrice}</strong>
                </p>
              </div>
              <button onClick={handlePayment}>Pay</button>{" "}
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

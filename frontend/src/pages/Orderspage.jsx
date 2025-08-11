import React, { useEffect, useState } from "react";
import "../styles/Orderspage.css";
import Navbar from "./Navbar";
import { retriveallorders } from "../api/cart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Rotates through provided image URLs at a fixed interval
const RotatingImages = ({ images, intervalMs = 3000, alt = "Order image" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex(0);
    const timerId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timerId);
  }, [images, intervalMs]);

  if (!images || images.length === 0) {
    return <img src="/placeholder.png" alt="No product image" />;
  }

  return <img src={images[currentIndex]} alt={alt} />;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showDownloadVideo, setShowDownloadVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await retriveallorders();
        console.log(data);
        const formatedOrders = (data || []).map((order) => {
          const addressParts = order.shipping_address?.split(",") || [];
          return {
            ...order,
            date: order.bought_at
              ? new Date(order.bought_at).toLocaleString()
              : "Unknown date",
            total: order.total_price || 0,
            address: {
              fullname: addressParts[0] || "",
              phone: addressParts[1] || "",
              address: addressParts[2] || "",
              city: addressParts[3] || "",
              state: addressParts[4] || "",
              pincode: addressParts[5] || "",
            },
            items: order.items || [],
          };
        });

        setOrders(formatedOrders.reverse());
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const downloadInvoice = (order, index) => {
    setShowDownloadVideo(true);
    const orderId = order.orderId || order.id || `order-${index}`;
    const input = document.getElementById(`order-invoice-${index}`);

    if (!input) return;

    const downloadButton = input.querySelector(".download-invoice-btn");
    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    html2canvas(input, { scale: 4 }).then((canvas) => {
      if (downloadButton) {
        downloadButton.style.display = "block";
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = (210 - imgWidth) / 2;
      const yOffset = (297 - imgHeight) / 4;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      pdf.save(`invoice-${orderId}.pdf`);
    });
  };

  const handleVideoEnded = () => {
    setShowDownloadVideo(false);
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
      <div className="orders-page">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">🛒 You have no completed orders.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="orderpictures">
                {(() => {
                  const productImages = (order.items || [])
                    .map(
                      (item) =>
                        item?.img ||
                        item?.image ||
                        item?.product?.images?.[0]?.image
                    )
                    .filter(Boolean);
                  return (
                    <RotatingImages
                      images={productImages}
                      intervalMs={3000}
                      alt={`Order ${index + 1} product`}
                    />
                  );
                })()}
              </div>
              <div
                id={`order-invoice-${index}`}
                className="order-invoice-content"
              >
                <div className="order-header">
                  <p>
                    <strong>Order Date:</strong> {order.date}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                </div>

                <div className="order-address">
                  <p>
                    <strong>Delivered To:</strong>
                  </p>
                  <p>
                    {order.address.fullname}, {order.address.phone}
                  </p>
                  <p>
                    {order.address.address}, {order.address.city},{" "}
                    {order.address.state} - {order.address.pincode}
                  </p>
                </div>

                <div className="order-items">
                  {(order.items || []).map((item, idx) => {
                    const productName =
                      item?.product_name || item?.product?.name || "Unknown Item";
                    const unitPrice = Number(
                      item?.price ?? item?.product?.price ?? 0
                    );
                    const imageUrl =
                      item?.product?.images?.[0]?.image || "/placeholder.png";
                    const quantity = Number(item?.quantity || 0);
                    const subtotal = (unitPrice * quantity).toFixed(2);
                    return (
                      <div key={idx} className="order-item">
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="order-img"
                        />
                        <div>
                          <p className="order-item-name">{productName}</p>
                          <p>Price: ₹{unitPrice.toFixed(2)}</p>
                          <p>Quantity: {quantity}</p>
                          <p>Subtotal: ₹{subtotal}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="download-invoice-btn"
                  onClick={() => downloadInvoice(order, index)}
                  disabled={showDownloadVideo}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDownloadVideo && (
        <div className="video-overlay">
          <video
            className="download-video"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            src={"/download-animation.mp4"}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};

export default Orders;

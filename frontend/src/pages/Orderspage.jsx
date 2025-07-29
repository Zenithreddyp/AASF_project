import React, { useEffect, useState } from "react";

import "../styles/Orderspage.css";

import Navbar from "./Navbar";

import { retriveallorders } from "../api/cart";

import html2canvas from "html2canvas";

import jsPDF from "jspdf";



const Orders = () => {

  const [orders, setOrders] = useState([]);



  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const data = await retriveallorders();

        console.log(data);

        const formatedOrders = data.map((order) => {

          const addressParts = order.shipping_address?.split(",") || [];



          return {

            ...order,

            date: new Date(order.bought_at).toLocaleString(),

            total: order.total_price,

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

    };



    fetchOrders();

  }, []);



  const downloadInvoice = (order, index) => {

    const input = document.getElementById(`order-invoice-${index}`);

    html2canvas(input, { scale: 2 }).then((canvas) => {

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm

      const pageHeight = 297; // A4 height in mm

      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;

      let position = 0;



      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;



      while (heightLeft >= 0) {

        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;

      }

      pdf.save(`invoice-order-${order.order_id}.pdf`);

    });

  };



  return (

    <>

      <Navbar currentPage="orders" />



      <div className="orders-page">

        <h2>Your Orders</h2>

        {orders.length === 0 ? (

          <p className="no-orders">🛒 You have no completed orders.</p>

        ) : (

          orders.map((order, index) => (

            <div key={index} className="order-card">

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

                  {order.items.map((item, idx) => (

                    <div key={idx} className="order-item">

                      <img

                        src={item.img}

                        alt={item.name}

                        className="order-img"

                      />

                      <div>

                        <p className="order-item-name">{item.name}</p>

                        <p>Price: {item.cost}</p>

                        <p>Quantity: {item.quantity}</p>

                        <p>

                          Subtotal: ₹

                          {Number(item.cost.replace(/[₹,]/g, "")) *

                            item.quantity}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              <button

                className="download-invoice-btn"

                onClick={() => downloadInvoice(order, index)}

              >

                Download Invoice

              </button>

            </div>

          ))

        )}

      </div>

    </>

  );

};



export default Orders;
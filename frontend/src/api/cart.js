import { privateApi } from "./axiosprivate";
import { validateToken } from "../components/authCheck";
import { useNavigate, useLocation } from "react-router-dom";

export const addtocart = async (item) => {
  const isAuth = await validateToken();
  if (!isAuth) {
    alert("Please login to add items to cart.");
    window.location.href = "/login";
    // navigate("/login", { state: { from: location.pathname } });
    return;
  }

  try {
    const res = await privateApi.post("/cart/cart/add/", {
      product_id: item.id,
      quantity: 1,
    });

    if (res.status === 201) {
      alert("Added to cart successfully!");
    }
  } catch (error) {
    alert("Failed to add to cart.");
  }
};

export const singleprodCart = async (item) => {
  const isAuth = await validateToken();
  if (!isAuth) {
    alert("Please login to buy items.");
    window.location.href = "/login?from=" + encodeURIComponent(window.location.pathname);
    return;
  }
  try {
    const res1 = await privateApi.post("/cart/create/new/cart/");

    if (res1.status === 201) {
      // const cart_id = res1.data.id;

      const res2 = await privateApi.post("/cart/cart/add/", {
        product_id: item.id,
        quantity: 1,
      });

      if (res2.status === 201) {
        alert("Added to cart successfully!");
      }
    }
  } catch (error) {
    console.error("Error:", error.response?.data || "Failed to add to cart.");
  }
};

export const removetempcart = async () => {
  try {
    await privateApi.delete(`/cart/delete/temp/cart/`);
    console.log("Temporary cart removed.");
  } catch (error) {
    console.error(
      "Error removing temp cart:",
      error.response?.data || error.message
    );
  }
};

export const updateQuant = async (cartItemId, newQuantity) => {
  try {
    const res = await privateApi.put(`cart/cart/update/${cartItemId}/`, {
      quantity: newQuantity,
    });
    alert("Quantity updated!");
    return res;
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Failed to update quantity");
    return null;
  }
};

export const removeItem = async (cartItemId) => {
  try {
    const res = await privateApi.delete(`/cart/cart/remove/${cartItemId}/`);

    alert("Item removed");
    return res;
  } catch (error) {
    console.error("Remove failed", error);
  }
};

export const placeOrder = async (shippingAddress,razorpayDetails) => {
  try {
    const formattedAddress = `${shippingAddress.full_name}, ${shippingAddress.phone_number}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postal_code}`;

    const response = await privateApi.post("/cart/cart/order/", {
      full_name: shippingAddress.full_name,
      phone_number: shippingAddress.phone_number,
      shipping_address: formattedAddress,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postal_code: shippingAddress.postal_code,
      total_price: shippingAddress.total_price,
      items: shippingAddress.items,
      razorpay_payment_id: razorpayDetails.razorpay_payment_id,
      razorpay_order_id: razorpayDetails.razorpay_order_id,
      razorpay_signature: razorpayDetails.razorpay_signature,
    });
    alert("Order placed");
    return response.data;
  } catch (error) {
    console.error("Order failed", error.response?.data || error.message);
    throw error;
  }
};

export const retriveallorders = async () => {
  try {
    const res = await privateApi.get("/cart/orders/");
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const dispCart = async () => {
  try {
    const res = await privateApi.get("/cart/cart/");
    return res.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const cancelOrder = async (orderId) => {
  try {
    await privateApi.put(`/cart/orders/cancel/${orderId}/`);
    alert("Order cancelled");
  } catch (error) {
    console.error("Cancellation failed", error);
  }
};

export const clearCart = async () => {
  try {
    await privateApi.delete("/cart/cart/clear");
    alert("Cart cleared");
  } catch (error) {
    console.error("Cart clearing failed", error);
  }
};

//not in use yet

export const downloadInvoice = async (orderId) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  try {
    const res = await privateApi.get(`/api/invoice/download/${orderId}/`, {
      responseType: "blob", // very imp to receive PDF as a blob
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `invoice_ZEDOVA_${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Failed to download invoice.");
  }
};


// export const fetchWishlist = async () => {
//   try {
//     const res = await privateApi.get(/* add url */);

//     return res.data;

//   } catch (error) {
    
//   }
// }
import { privateApi } from "./axiosprivate";
import { validateToken } from "../components/authCheck";

export const addtocart = async (item) => {

  // const isAuth = await validateToken();
  // if (!isAuth) {
  //   alert("Please login to add items to cart.");
  //   window.location.href = "/login";  // or use navigate if inside a component
  //   return;
  // }

  try {
    const res = await privateApi.post("/cart/cart/add/", {
      product: item.id,
      quantity: 1,
    });

    if (res.status === 201) {
      alert("Added to cart successfully!");
    }
  } catch (error) {
    console.error("Add to cart failed:", error);
    alert("Failed to add to cart.");
  }
};

export const updateQuantity = async (cartItemId, newQuantity) => {
  try {
    const res = await privateApi.put(`/cart/item/${cartItemId}/update/`, {
      quantity: newQuantity,
    });
    alert("Quantity updated!");
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Failed to update quantity");
  }
};

export const removeItem = async (cartItemId) => {
  try {
    await privateApi.delete(`/cart/remove/${cartItemId}/`);
    alert("Item removed");
  } catch (error) {
    console.error("Remove failed", error);
  }
};

export const placeOrder = async () => {
  try {
    await privateApi.post("/cart/cart/order");
    alert("Prder placed");
  } catch (error) {
    console.error("Order failed", error);
  }
};


export const dispCart = async () => {
  try {
    const res = await privateApi.get("/cart/");
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
    console.error("Cart clearing failed",error);
  }
};



export const downloadInvoice = async (orderId) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  try {
    const res = await privateApi.get(`/api/invoice/download/${orderId}/`, {
      responseType: 'blob', // very imp to receive PDF as a blob
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

import { privateApi } from "./axiosprivate";
import { validateToken } from "../components/authCheck";

export const fetchWishlist = async () => {
  try {
    const res = await privateApi.get("/cart/wishlist/");
    return res.data; // list with one wishlist object containing items
  } catch (error) {
    console.error("Error fetching wishlist:", error.response?.data || error.message);
    return [];
  }
};

export const addToWishlist = async (productId) => {
  const isAuth = await validateToken();
  if (!isAuth) {
    alert("Please login to add items to wishlist.");
    window.location.href = "/login";
    return;
  }
  try {
    const res = await privateApi.post("/cart/wishlist/add/", {
      product_id: productId,
    });
    if (res.status === 201 || res.status === 200) {
      alert("Added to wishlist!");
    }
    return res.data;
  } catch (error) {
    console.error("Failed to add to wishlist:", error.response?.data || error.message);
    alert("Failed to add to wishlist.");
    throw error;
  }
};

export const removeWishlistItem = async (wishlistItemId) => {
  try {
    const res = await privateApi.delete(`/cart/wishlist/remove/${wishlistItemId}/`);
    return res;
  } catch (error) {
    console.error("Failed to remove wishlist item:", error.response?.data || error.message);
    throw error;
  }
};

export const moveWishlistItemToCart = async (productId) => {
  try {
    const res = await privateApi.post(`/cart/wishlist/move-to-cart/${productId}/`);
    return res.data;
  } catch (error) {
    console.error("Failed to move to cart:", error.response?.data || error.message);
    throw error;
  }
};



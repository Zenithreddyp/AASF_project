import { privateApi } from "./axiosprivate";
import { validateToken } from "../components/authCheck";
import { data } from "react-router-dom";

export const fetchuserAllAddress = async () => {
  const isAuth = await validateToken();
  if (!isAuth) {
    alert("Please login to add items to cart.");
    window.location.href = "/login";
    return;
  }

  try {
    const res = await privateApi.get("/users/shippingaddress/");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const addNewAddress = async (shippingaddress) => {
  const isAuth = await validateToken();
  if (!isAuth) {
    alert("Please login to add items to cart.");
    window.location.href = "/login";
    return false;
  }

  try {
    const res = await privateApi.post("/users/new/shippingaddress/", {
        //{ fullname, phone, address, city, state };
      full_name: shippingaddress.fullname,
      phone_number: shippingaddress.phone,
      address: shippingaddress.address,
      city: shippingaddress.city,
      state: shippingaddress.state,
      postal_code: "100000",
      // is_default: true,
    });
    return true;

    // Optional: success message or redirect
    alert("Address added successfully!");
  } catch (error) {
    
    // ✅ Handle validation or server errors here
    if (error.response && error.response.data) {
      const errors = error.response.data;
      console.error("Validation errors:", errors);

      // Display first error to user (customize as needed)
      const messages = Object.entries(errors).map(
        ([field, messages]) => `${field}: ${messages.join(", ")}`
      );
      alert("Failed to add address:\n" + messages.join("\n"));
    } else {
      // Fallback error if no response
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
    return false;
  }
};


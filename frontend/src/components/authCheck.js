import { jwtDecode } from "jwt-decode";
import api from "../api/api";  // public API
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const validateToken = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      // Token expired, try refresh
      const res = await api.post("/users/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        return true;
      } else {
        return false;
      }
    }

    return true; // token is valid
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

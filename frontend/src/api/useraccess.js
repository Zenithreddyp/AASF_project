import { publicApi } from "./axiospublic";
import { validateToken } from "../components/authCheck";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const login = async (username, password) => {
  try {
    const res = await publicApi.post("/users/token/", {
      username,
      password,
    });
    
    localStorage.setItem(ACCESS_TOKEN, res.data.access);
    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;

  }
};



export const register = async (username,password) => {
  try {
    const res = await publicApi.post("users/user/create/",{
      username,password,
    });

    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.username
    ) {
      alert(error.response.data.username[0]);
    }
    console.error("Registration error:", error);
    return false;

  }
}
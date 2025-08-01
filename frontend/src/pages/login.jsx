import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register } from "../api/useraccess";
import "../styles/login.css";
import Navbar from "./Navbar";

function AuthPage() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginUsername, loginPassword);
    if (res) {
      alert("Login successful!");
      navigate(from);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(registerUsername, registerPassword);
    if (res) {
      alert("Registration successful! Please log in.");
      setIsLoginActive(true);
      setRegisterUsername("");
      setRegisterPassword("");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="loginbox">
        <div className={`container ${isLoginActive ? "" : "active"}`}>
          <div className="form-box login">
            <form onSubmit={handleLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              <p>or login with social platforms</p>
              <div className="social-icons">
                <a href="#">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-github"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form onSubmit={handleRegister}>
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <button type="submit" className="btn">
                Register
              </button>
              <p>or register with social platforms</p>
              <div className="social-icons">
                <a href="#">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-github"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>
            </form>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button
                className="btn register-btn"
                onClick={() => setIsLoginActive(false)}
              >
                Register
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button
                className="btn login-btn"
                onClick={() => setIsLoginActive(true)}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPage;

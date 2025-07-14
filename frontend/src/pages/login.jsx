import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/useraccess";
import "../styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    const res = await login(username,password);
    if (res) {
        alert("legin succesfull");
        navigate("/",);
    }else{
        alert("Invalid username or password");
    }
  }


  return (
    <div className="firstpage">
      <div className="videohalf">
        <video
          className="video"
          src="/Vedio.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="video-text">Welcome to Zedova</div>
      </div>

      <div className="loginhalf">
        <div className="loginbox">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlelogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;

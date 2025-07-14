import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { register,login } from "../api/useraccess";
import "../styles/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegisterandlogin = async () => {
    const res = await register(username, password);
    if (res) {
      alert("Registration successful , loging in you please wait...");
      await login(username,password);
      navigate("/");
    } else {
      alert("resgistration failed");
    }
  };

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

      <div className="Registerhalf">
        <div className="Registerbox">
          <h2>Register</h2>
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
          <button onClick={(handleRegisterandlogin)}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Register;

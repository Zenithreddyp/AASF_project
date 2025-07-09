import React from 'react';
import '../styles/login.css';

function Login() {
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
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;

import React from 'react';
import '../styles/Register.css';

function Register() {
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
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Newlogin.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Newlogin = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSign = (e) => {
    e.preventDefault();
    navigate("/sign");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Login
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Login failed: " + errorData.message);
        return;
      }

      const data = await res.json();

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dash");
    } catch (error) {
      alert("Error connecting to server: " + error.message);
    }
  };

  return (
    <div className="newlogin-container font-roboto">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h3 className="opacity-50 text-white text-left">
            Please enter your details
          </h3>
          <h2 className="font-bold text-left">Welcome Back!</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-field">
            <input
              type="text"
              autoComplete="off"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Enter your email</label>
          </div>
          <div className="input-field">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 bg-transparent border-none outline-none text-base text-white px-2.5 peer"
            />
            
            <span
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-white text-xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
            <label>Enter your password</label>
          </div>
          <div className="forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" required />
              <p>Remember me</p>
            </label>
          </div>
          <button type="submit">Log In</button>
          <div className="register">
            <p onClick={handleSign}>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newlogin;

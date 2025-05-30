import React from "react";
// import { useNavigate } from "react-router-dom";
import "../Styles/Newlogin.css";
import { useNavigate } from 'react-router-dom';

const Newlogin = () => {
  const navigate = useNavigate();
  
  const handleSign = (e) => {
    e.preventDefault(); 
    navigate('/sign'); 
  };
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    navigate('/home'); 
  };

  return (
    <div className="newlogin-container font-roboto">
      <div className="wrapper">
        <form action="#">
            <h3 className="opacity-50 text-white text-left">Please enter your details</h3>
          <h2 className="font-bold text-left">Welcome Back!</h2>
          <div className="input-field">
            <input type="text" required />
            <label>Enter your email</label>
          </div>
          <div className="input-field">
            <input type="password" required />
            <label>Enter your password</label>
          </div>
          <div className="forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              <p>Remember me</p>
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" onClick={handleSubmit}>Log In</button>
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
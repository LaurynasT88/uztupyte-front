import React, { useState } from "react";
import axios from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../Login.css';  // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(""); // State for Forgot Password email
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle between login and forgot password
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { username, password });
      const token = response.data.jwt;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const userRoles = decodedToken.ROLES || [];
      localStorage.setItem("roles", JSON.stringify(userRoles));

      userRoles.includes("ADMIN") ? navigate("/admin") : navigate("/");
    } catch (err) {
      if (err.response) {
        if (err.response.data.failureReason && err.response.data.failureReason.includes("User not verified")) {
          setError("User not verified, please check your email for the verification link.");
        } else {
          setError("Invalid username or password");
        }
      } else {
        setError("An error occurred, please try again later.");
      }
    }
  };




  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgot", { email: forgotPasswordEmail });
      setSuccess("Password reset email sent. Please check your inbox.");
      setError("");
    } catch (err) {
      setError("Email not found or an error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
      <div className="login-container">
        <h2>{isForgotPassword ? "Forgot Password" : "Login"}</h2>
        {isForgotPassword ? (
            // Forgot Password form
            <form onSubmit={handleForgotPassword}>
              <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Send Reset Link</button>
            </form>
        ) : (
            // Login form
            <form onSubmit={handleLogin}>
              <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit">Login</button>
            </form>
        )}
        <p>
          {isForgotPassword ? (
              <>
                Remembered your password? <Link to="#" onClick={() => setIsForgotPassword(false)}>Back to Login</Link>.
              </>
          ) : (
              <>
                Don't have an account? <Link to="/register">Register here</Link>.
                <br />
                <Link to="#" onClick={() => setIsForgotPassword(true)}>Forgot Password?</Link>
              </>
          )}
        </p>
      </div>
  );
};

export default Login;

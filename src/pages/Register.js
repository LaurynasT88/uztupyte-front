import React, { useState } from "react";
import axios from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import '../Login.css';  // Reuse the Login.css for consistency

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("USER"); // Default role is USER
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/register", {
        username,
        password,
        email,
        firstName,
        lastName,
        role,
      });
      setSuccess("Registration successful! Please login.");
      setError("");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError("Registration failed. Please try again.");
      setSuccess("");
      console.error(err);
    }
  };

  return (
      <div className="login-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
          <div>
            <label>Email:</label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
          </div>

          {error && <p className="error-message">{error}</p>}  {/* Styled error message */}
          {success && <p className="success-message">{success}</p>} {/* Styled success message */}
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
  );
};

export default Register;

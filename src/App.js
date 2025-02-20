import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
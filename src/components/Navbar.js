import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    const isAdmin = roles.includes("ADMIN");
    const isAuthenticated = !!token;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                {/* Show Home if NOT an admin or when an admin is logged in */}
                {(isAdmin || !isAuthenticated) && (
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        Home
                    </NavLink>
                )}

                {/* Show Admin Panel if user is an admin */}
                {isAdmin && (
                    <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                        Admin Panel
                    </NavLink>
                )}

                {/* Show Logout if authenticated, otherwise show Login */}
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

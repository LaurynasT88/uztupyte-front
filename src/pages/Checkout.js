import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Checkout.css";


const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(location.state?.cart || []);

    // State for shipping details
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        phone: "",
        city: "",
        street: "",
        houseFlat: "",
        postcode: "",
    });

    // Handle input change
    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    // Function to remove item from cart
    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    // Proceed to payment (placeholder for now)
    const handlePayment = () => {
        console.log("Shipping Info:", shippingInfo);
        console.log("Cart:", cart);
        console.log("Proceeding to payment...");
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            {/* Cart Summary */}
            <div className="cart-summary">
                <h3>Order Summary</h3>
                {cart.length > 0 ? (
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                {item.name} - ${item.price.toFixed(2)}
                                <button className="remove-item-btn" onClick={() => removeFromCart(index)}>
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Your cart is empty.</p>
                )}
                <p className="total-price">
                    Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </p>
            </div>

            {/* Shipping Form */}
            <div className="shipping-form">
                <h3>Shipping Information</h3>
                <form>
                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleChange} required />

                    <label>Phone Number:</label>
                    <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleChange} required />

                    <label>City:</label>
                    <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />

                    <label>Street Name:</label>
                    <input type="text" name="street" value={shippingInfo.street} onChange={handleChange} required />

                    <label>House / Flat Number:</label>
                    <input type="text" name="houseFlat" value={shippingInfo.houseFlat} onChange={handleChange} required />

                    <label>Postcode:</label>
                    <input type="text" name="postcode" value={shippingInfo.postcode} onChange={handleChange} required />
                </form>
            </div>

            {/* Proceed to Payment */}
            <button className="pay-button" onClick={handlePayment} disabled={cart.length === 0}>
                Proceed to Payment
            </button>
        </div>
    );
};

export default Checkout;

import React, { useEffect, useState } from "react";
import axios from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(true); // Controls cart visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="store-title">Uztupyte Art</h1>
        </nav>

        {/* Toggle Button for Cart */}
        <button className={`cart-toggle-btn ${cartOpen ? "cart-open" : ""}`} onClick={toggleCart}>
          {cartOpen ? "←" : "→"}
        </button>

        {/* Cart Section */}
        <div className={`cart-section ${cartOpen ? "" : "cart-collapsed"}`}>
          <h3 className="cart-title">Cart</h3>
          <ul className="cart-list">
            {cart.map((item, index) => (
                <li key={index}>{item.name} - ${item.price.toFixed(2)}</li>
            ))}
          </ul>

          {/* Show total and checkout button only if the cart has items */}
          {cart.length > 0 && (
              <>
                <p className="cart-total visible">Total: ${calculateTotal()}</p>
                <button className="checkout-button visible">Proceed to Checkout</button>
              </>
          )}
        </div>

        {/* Products */}
        <div className="container">
          <h2>Art Products</h2>
          {loading ? (
              <p>Loading products...</p>
          ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
          ) : (
              <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <img
                          src={`http://localhost:8080/api/products/${product.id}/images`}
                          alt={product.name}
                          className="product-image"
                      />
                      <h3>{product.name}</h3>
                      <p className="short-description">{product.shortDescription}</p>

                      <button
                          onClick={() =>
                              setExpandedProduct(expandedProduct === product.id ? null : product.id)
                          }
                          className="expand-button"
                      >
                        {expandedProduct === product.id ? "Hide Details" : "Show Details"}
                      </button>
                      {expandedProduct === product.id && (
                          <p className="long-description">{product.longDescription}</p>
                      )}

                      <p>Price: ${product.price.toFixed(2)}</p>
                      <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default Home;

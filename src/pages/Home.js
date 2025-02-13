import React, {useEffect, useState} from "react";
import axios from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        // Transform data to match expected format
        const formattedProducts = response.data.map(product => ({
          id: product.id,
          name: product.name,
          price: `$${product.price.toFixed(2)}`
        }));

        setProducts(formattedProducts);
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

  return (
      <div className="container">
        <h2>Products</h2>
        {loading ? (
            <p>Loading products...</p>
        ) : error ? (
            <p style={{color: "red"}}>{error}</p>
        ) : (
            <ul className="product-list">
              {products.map((product) => (
                  <li key={product.id}>
                    {product.name} - {product.price}
                    <button onClick={() => addToCart(product)}>Add to Cart
                    </button>
                  </li>
              ))}
            </ul>
        )}

        <h3>Cart</h3>
        <ul className="cart-list">
          {cart.map((item, index) => (
              <li key={index}>{item.name} - {item.price}</li>
          ))}
        </ul>
      </div>
  );
};

export default Home;

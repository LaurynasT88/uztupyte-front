import React, {useState} from "react";

const Home = () => {

  const [products, setProducts] = useState([
    {id: 1, name: "Product A", price: "$10"},
    {id: 2, name: "Product B", price: "$20"},
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
      <div className="container">
        <h2>Products</h2>
        <ul className="product-list">
          {products.map((product) => (
              <li key={product.id}>
                {product.name} - {product.price}
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </li>
          ))}
        </ul>

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

import React, { useEffect, useState } from "react";
import axios from "../services/api";
import "../App.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "User1", blocked: false },
    { id: 2, name: "User2", blocked: true },
  ]);
  const [orders] = useState([{ id: 1, user: "User1", status: "Shipped" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State to toggle add product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");

        const formattedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription,
          price: product.price,
          quantity: product.inventory.quantity,
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

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleBlockUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, blocked: !user.blocked } : user)));
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditProduct({
      ...editProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) || 0 : value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`/api/admin/products/${editProduct.id}`, {
        name: editProduct.name,
        shortDescription: editProduct.shortDescription,
        longDescription: editProduct.longDescription,
        price: parseFloat(editProduct.price),
        quantity: parseInt(editProduct.quantity),
      });

      setProducts(products.map((p) => (p.id === editProduct.id ? editProduct : p)));
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) || 0 : value,
    });
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/products", newProduct);
      const addedProduct = {
        id: response.data.id,
        name: response.data.name,
        shortDescription: response.data.shortDescription,
        longDescription: response.data.longDescription,
        price: response.data.price,
        quantity: response.data.inventory.quantity,
      };

      setProducts([...products, addedProduct]);
      setNewProduct({
        name: "",
        shortDescription: "",
        longDescription: "",
        price: 0,
        quantity: 0,
      });
      setShowAddProductForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      <h3>Manage Products</h3>
      <button onClick={() => setShowAddProductForm(!showAddProductForm)}>
        {showAddProductForm ? "Cancel" : "Add Product"}
      </button>

      {showAddProductForm && (
        <div className="modal-overlay" onClick={() => setShowAddProductForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProductSubmit}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleAddProductChange}
                required
              />

              <label>Short Description:</label>
              <input
                type="text"
                name="shortDescription"
                value={newProduct.shortDescription}
                onChange={handleAddProductChange}
                required
              />

              <label>Long Description:</label>
              <textarea
                name="longDescription"
                value={newProduct.longDescription}
                onChange={handleAddProductChange}
                required
              />

              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleAddProductChange}
                required
              />

              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleAddProductChange}
                required
              />

              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-item">
              <span className="product-name">
                {product.name} - ${product.price.toFixed(2)}
              </span>
              <div className="product-actions">
                <button onClick={() => handleEditClick(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Manage Users</h3>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.blocked ? "Blocked" : "Active"}
            <button onClick={() => toggleBlockUser(user.id)}>
              {user.blocked ? "Unblock" : "Block"}
            </button>
          </li>
        ))}
      </ul>

      <h3>Orders</h3>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id}>
            {order.user} - {order.status}
          </li>
        ))}
      </ul>

      {editProduct && (
        <div className="modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Product</h3>
            <label>Name:</label>
            <input type="text" name="name" value={editProduct.name} onChange={handleEditChange} />

            <label>Short Description:</label>
            <input
              type="text"
              name="shortDescription"
              value={editProduct.shortDescription}
              onChange={handleEditChange}
            />

            <label>Long Description:</label>
            <textarea
              name="longDescription"
              value={editProduct.longDescription}
              onChange={handleEditChange}
            />

            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={handleEditChange}
            />

            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={editProduct.quantity}
              onChange={handleEditChange}
            />

            <button onClick={handleEditSubmit}>Save</button>
            <button onClick={() => setEditProduct(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
import React, { useEffect, useState } from "react";
import axios from "../services/api";
import "../Admin.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    price: 0,
    quantity: 0,
  });

  // Fetch products
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

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open edit form
  const handleEditClick = (product) => {
    setEditProduct(product);
    setSelectedImage(null);
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) || 0 : value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Upload image
  const handleImageUpload = async (productId, file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`/api/admin/products/${productId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Save edited product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/api/admin/products/${editProduct.id}`, editProduct);
      setProducts(products.map((product) => (product.id === editProduct.id ? response.data : product)));

      if (selectedImage) {
        await handleImageUpload(editProduct.id, selectedImage);
      }

      setEditProduct(null);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  // Handle add product input changes
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) || 0 : value,
    });
  };

  // Handle file input for new product
  const handleNewProductFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Submit new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/admin/products", newProduct);
      const addedProduct = response.data;

      if (selectedImage) {
        await handleImageUpload(addedProduct.id, selectedImage);
      }

      setProducts([...products, addedProduct]);
      setShowAddProductForm(false);
      setNewProduct({ name: "", shortDescription: "", longDescription: "", price: 0, quantity: 0 });
      setSelectedImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
      <div className="admin-container">
        <div className="admin-header">
         Product Control
        </div>

        <button className="add-product-btn" onClick={() => setShowAddProductForm(true)}>
          Add New Product
        </button>

        <div className="admin-product-grid">
          {loading ? (
              <p>Loading products...</p>
          ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
          ) : (
              <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                      <img src={`http://localhost:8080/api/products/${product.id}/images`} alt={product.name}
                           className="admin-product-image"/>
                      <span className="product-name">{product.name} - ${product.price.toFixed(2)}</span>

                      <h2 style={{marginTop: "10px"}}>Short Description</h2>
                      <br/>
                      <p>{product.shortDescription}</p>

                      <h2 style={{marginTop: "15px"}}>Long Description</h2>
                      <br/>
                      <p>{product.longDescription}</p>
                      <br/>

                      <div className="product-actions">
                        <button onClick={() => handleEditClick(product)}>Edit</button>
                        <button onClick={() => deleteProduct(product.id)}>Delete</button>
                      </div>
                    </li>
                ))}
              </ul>
          )}
        </div>

        {editProduct && (
            <div className="modal-overlay" onClick={() => setEditProduct(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Product</h3>
                <form onSubmit={handleEditSubmit}>
                  <label>Name:</label>
                  <input type="text" name="name" value={editProduct.name} onChange={handleEditChange} />

                  <label>Short Description:</label>
                  <input type="text" name="shortDescription" value={editProduct.shortDescription} onChange={handleEditChange} />

                  <label>Long Description:</label>
                  <textarea name="longDescription" value={editProduct.longDescription} onChange={handleEditChange} />

                  <label>Price:</label>
                  <input type="number" name="price" value={editProduct.price} onChange={handleEditChange} />

                  <label>Quantity:</label>
                  <input type="number" name="quantity" value={editProduct.quantity} onChange={handleEditChange} />

                  <label>Image:</label>
                  <input type="file" onChange={handleFileChange} />

                  <button type="submit">Save</button>
                  <button onClick={() => setEditProduct(null)}>Cancel</button>
                </form>
              </div>
            </div>
        )}

        {showAddProductForm && (
            <div className="modal-overlay" onClick={() => setShowAddProductForm(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <label>Name:</label>
                  <input type="text" name="name" value={newProduct.name} onChange={handleNewProductChange} />

                  <label>Short Description:</label>
                  <input type="text" name="shortDescription" value={newProduct.shortDescription} onChange={handleNewProductChange} />

                  <label>Long Description:</label>
                  <textarea name="longDescription" value={newProduct.longDescription} onChange={handleNewProductChange} />

                  <label>Price:</label>
                  <input type="number" name="price" value={newProduct.price} onChange={handleNewProductChange} />

                  <label>Quantity:</label>
                  <input type="number" name="quantity" value={newProduct.quantity} onChange={handleNewProductChange} />

                  <label>Image:</label>
                  <input type="file" onChange={handleNewProductFileChange} />

                  <button type="submit">Add Product</button>
                  <button onClick={() => setShowAddProductForm(false)}>Cancel</button>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Admin;

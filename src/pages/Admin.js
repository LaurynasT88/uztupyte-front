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
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    price: 0,
    quantity: 0,
    images: [], // New field for multiple images
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
          images: product.images, // Assuming the product data has an 'images' field
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

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) || 0 : value,
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewProduct({
      ...newProduct,
      images: files, // Store the selected files in state
    });
  };

  const handleImageUpload = async (productId, files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]); // Use "images" as the key
    }
  
    try {
      await axios.post(
        `/api/admin/products/${productId}/images`, // API endpoint for image upload
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/admin/products/${editProduct.id}/images/${imageId}`);
      setEditProduct({
        ...editProduct,
        images: editProduct.images.filter((img) => img.id !== imageId), // Remove deleted image from state
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // First, create the product (without images)
      const response = await axios.post("/api/admin/products", {
        name: newProduct.name,
        shortDescription: newProduct.shortDescription,
        longDescription: newProduct.longDescription,
        price: newProduct.price,
        quantity: newProduct.quantity,
      });
  
      const productId = response.data.id; // Get the new product ID
  
      // If images were selected, upload them
      if (newProduct.images.length > 0) {
        await handleImageUpload(productId, newProduct.images);
      }
  
      // Refresh product list
      setProducts([...products, response.data]);
  
      // Reset form
      setShowAddProductForm(false);
      setNewProduct({
        name: "",
        shortDescription: "",
        longDescription: "",
        price: 0,
        quantity: 0,
        images: [],
      });
  
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.patch(`/api/admin/products/${editProduct.id}`, editProduct);
      setProducts(products.map((product) =>
        product.id === editProduct.id ? response.data : product
      ));
  
      // If new images were selected, upload them
      if (newProduct.images.length > 0) {
        await handleImageUpload(editProduct.id, newProduct.images);
      }
  
      setEditProduct(null); // Close the edit form
    } catch (error) {
      console.error("Error editing product:", error);
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

              <label>Images:</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange} // Use the new handler
              />
              <div>
                {newProduct.images && Array.from(newProduct.images).map((img, index) => (
                  <img key={index} src={URL.createObjectURL(img)} alt={`Product image ${index + 1}`} width={100} />
                ))}
              </div>

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
                {product.images && product.images.length > 0 && (
                  <div>
                    {product.images.map((img, index) => (
                      <img key={index} src={img.url} alt={`Product image ${index + 1}`} width={50} />
                    ))}
                  </div>
                )}
                <button onClick={() => handleEditClick(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editProduct && (
        <div className="modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Product</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editProduct.name}
                onChange={handleEditChange}
              />

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

              <label>Images:</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange} // Use the new handler
              />
              <div>
                {editProduct.images && editProduct.images.map((img, index) => (
                  <div key={index}>
                    <img src={img.url} alt={`Product image ${index + 1}`} width={100} />
                    <button onClick={() => handleDeleteImage(img.id)}>Delete</button>
                  </div>
                ))}
              </div>

              <button type="submit">Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

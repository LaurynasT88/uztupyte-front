import React, { useState } from "react";

const Admin = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", price: "$10" },
    { id: 2, name: "Product B", price: "$20" },
  ]);
  const [users, setUsers] = useState([
    { id: 1, name: "User1", blocked: false },
    { id: 2, name: "User2", blocked: true },
  ]);
  const [orders] = useState([{ id: 1, user: "User1", status: "Shipped" }]);

  const toggleBlockUser = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, blocked: !user.blocked } : user));
  };

  return (
      <div className="container">
        <h2>Admin Panel</h2>

        <h3>Manage Products</h3>
        <ul className="product-list">
          {products.map((product) => (
              <li key={product.id}>
                {product.name} - {product.price}
                <button>Edit</button>
                <button>Delete</button>
              </li>
          ))}
        </ul>

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
              <li key={order.id}>{order.user} - {order.status}</li>
          ))}
        </ul>
      </div>
  );
};

export default Admin;

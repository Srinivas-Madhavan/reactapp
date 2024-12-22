// src/components/Order/OrderTracking.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./../styles/ordertracking.module.css";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/orders?userId=${currentUser.id}`
        );
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          const createdDate = new Date(order.orderDate).valueOf();
          const currentDate = Date.now();
          const timeDiffInSeconds = (currentDate - createdDate) / 1000;

          let updatedStatus = order.status;

          if (timeDiffInSeconds > 8) {
            updatedStatus = "Delivered";
          } else if (timeDiffInSeconds > 4) {
            updatedStatus = "Confirmed";
          }

          order.status = updatedStatus;
          updateOrderStatus(order);

          return order;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (order) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        navigate("/login");
        return;
      }

      await axios.put(`http://localhost:5000/orders/${order.id}`, order);
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter((order) =>
      order.id.toLowerCase().includes(term)
    );

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return classes.confirmed;
      case "pending":
        return classes.pending;
      case "delivered":
        return classes.delivered;
      default:
        return classes.default;
    }
  };

  if (loading) {
    return (
      <div title="Order Tracking">
        <div>
          <div>Loading orders...</div>
        </div>
      </div>
    );
  }

  const content = (
    <div>
      {error && <div>{error}</div>}

      <header>
        <p className={classes.header}>Food ordering app</p>
        <div className={classes.headerComponent}>
          <button onClick={() => navigate("/home")} variant="outlined">
            HOME
          </button>
          <button onClick={() => navigate("/order-confirm")} variant="outlined">
            ORDER-CONFIRM
          </button>
          <button onClick={() => navigate("/settings")} variant="outlined">
            SETTINGS
          </button>
          <button onClick={() => navigate("/")} variant="outlined">
            LOGOUT
          </button>
        </div>
      </header>

      <input
        placeholder="Search by Order ID"
        value={searchTerm}
        onChange={handleSearch}
        className={classes.searchInput}
      />

      {filteredOrders.length === 0 ? (
        <div className={classes.noItems}>
          <p>No orders found</p>
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.tableContainer}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Delivery Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}{" "}
                      {order.deliveryAddress.zipCode},{" "}
                      {order.deliveryAddress.country}
                    </td>
                    <td>
                      <span className={`${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return <div className={classes.main}>{content}</div>;
};

export default OrderTracking;

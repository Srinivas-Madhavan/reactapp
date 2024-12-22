import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./../styles/orderconfirm.module.css";

const OrderConfirm = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);

    let cartTotal = 0;

    for (let item of items) {
      cartTotal += item.cost * item.quantity;
    }
    setTotal(cartTotal);
  }, []);

  const removeItem = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));

    if (newItems.length == 0) {
      setTotal(0);
    } else {
      let newTotal = 0;
      for (let item of newItems) {
        newTotal += item.cost * item.quantity;
      }
      setTotal(newTotal);
    }
  };

  return (
    <div className={classes.main}>
      {/* Header */}
      <header>
        <p className={classes.header}>Food ordering app</p>
        <div className={classes.headerComponent}>
          <button onClick={() => navigate("/home")} variant="outlined">
            HOME
          </button>
          <button
            onClick={() => navigate("/order-tracking")}
            variant="outlined"
          >
            ORDER-TRACKING
          </button>
          <button onClick={() => navigate("/settings")} variant="outlined">
            SETTINGS
          </button>
          <button onClick={() => navigate("/")} variant="outlined">
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <div>
        <div>
          <div className={classes.container}>
            {/* Cart Items Section */}
            <div className={classes.tableContainer}>
              <h2 className={classes.cartHeading}>Current Cart</h2>
              {cartItems.length != 0 ? (
                <table className={classes.table}>
                  <th></th>
                  <th>#Item</th>
                  <th>Base price</th>
                  <th>QTY</th>
                  <th>Item price</th>
                  <th></th>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={item.imageURL} alt={item.dishName} />
                      </td>
                      <td>
                        <p>{item.dishName}</p>
                        <p>{item.description}</p>
                      </td>
                      <td>
                        <p>Base price: ${item.cost}</p>
                      </td>
                      <td>
                        <p>Qty: {item.quantity}</p>
                      </td>
                      <td>
                        <p>
                          Item Total: ${(item.cost * item.quantity).toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <button onClick={() => removeItem(index)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </table>
              ) : (
                <p className={classes.noItems}>No items in cart</p>
              )}
            </div>

            {/* Order Review Section */}
            <div className={classes.review}>
              <div>
                <h2 className={classes.reviewHeader}>Review Order</h2>
                <div className={classes.reviewContainer}>
                  <p>
                    Subtotal ({cartItems.length} items) : ${total.toFixed(2)}
                  </p>
                  <p>Tax : ${(total * 0.1).toFixed(2)}</p>
                  <p>Order Total : ${(total * 1.1).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => navigate("/payment")}
                  disabled={cartItems.length === 0}
                  className={classes.checkout}
                >
                  Checkout / Place Order
                </button>

                <div className={classes.paymentAddress}>
                  <button onClick={() => navigate("/settings")}>
                    Add Address
                  </button>
                  <button onClick={() => navigate("/settings")}>
                    Add Payment Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p className={classes.footer}>
          @Food Order Project | DATE: {new Date().toLocaleDateString()} | TIME:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </footer>
    </div>
  );
};

export default OrderConfirm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./../styles/payment.module.css";
import qrcode from "./../qrcode_www.google.com.png";

const Payment = () => {
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'upi'

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/paymentDetails?userId=${currentUser.id}`
        );
        setSavedCards(response.data);
      } catch (error) {
        setError("Error fetching saved cards");
      }
    };

    fetchCards();
  }, [navigate]);

  const handlePayment = async () => {
    if (paymentMethod === "card" && !selectedCard) {
      setError("Please select a card");
      return;
    }

    setLoading(true);
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const addressResponse = await axios.get(
        `http://localhost:5000/address?userId=${currentUser.id}`
      );
      const deliveryAddress = addressResponse.data[0];

      let totalAmount = 0;

      for (let item of cartItems) {
        totalAmount += item.cost * item.quantity;
      }

      const tax = totalAmount * 0.1;
      const finalAmount = totalAmount + tax;

      const newOrder = {
        id: Math.random().toString(36).substr(2, 4),
        userId: currentUser.id,
        items: cartItems,
        totalAmount: finalAmount,
        paymentMethod: paymentMethod,
        paymentId:
          paymentMethod === "card" ? selectedCard.id : `upi_${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: "Pending",
        deliveryAddress,
      };

      await axios.post("http://localhost:5000/orders", newOrder);
      localStorage.removeItem("cartItems");

      alert(
        "Payment successful! Your order is on the way. Estimated delivery time: 30-45 minutes"
      );
      navigate("/home");
    } catch (error) {
      setError("Payment failed. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.main}>
      <header>
        <p className={classes.header}>Food ordering app</p>
        <div className={classes.headerComponent}>
          <button onClick={() => navigate("/order-confirm")} variant="outlined">
            ORDER-CONFIRM
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
      <div className={classes.container}>
        <div>
          <p className={classes.payment}>Select Payment Method</p>

          {error && <p>{error}</p>}

          {/* Payment Method Selection */}
          <div className={classes.buttonContainer}>
            <button
              onClick={() => setPaymentMethod("card")}
              className={paymentMethod == "card" ? classes.active : null}
            >
              Card Payment
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={paymentMethod == "upi" ? classes.active : null}
            >
              UPI Payment
            </button>
          </div>

          {/* Card Payment Section */}
          {paymentMethod === "card" && (
            <div className={classes.cards}>
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`${classes.card} ${
                    selectedCard == card ? classes.selectedCard : null
                  }`}
                >
                  <div>
                    <div>
                      <p>Card ending in {card.cardNumber.slice(-4)}</p>
                      <p>{card.cardHolder}</p>
                      <p>Expires: {card.expiryDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* UPI Payment Section */}
          {paymentMethod === "upi" && (
            <div className={classes.upi}>
              <p>Scan QR Code to Pay</p>
              <img src={qrcode} className={classes.qrCode}></img>
              <p>
                Open your UPI app and scan this code to complete the payment
              </p>
            </div>
          )}

          <div className={classes.bottomButtons}>
            <button onClick={() => navigate("/order-confirm")}>Cancel</button>
            <button
              onClick={handlePayment}
              disabled={loading || (paymentMethod === "card" && !selectedCard)}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

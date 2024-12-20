import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/paymentDetails?userId=${currentUser.id}`);
        setSavedCards(response.data);
      } catch (error) {
        setError('Error fetching saved cards');
      }
    };

    fetchCards();
  }, [navigate]);

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !selectedCard) {
      setError('Please select a card');
      return;
    }

    setLoading(true);
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const addressResponse = await axios.get(`http://localhost:5000/address?userId=${currentUser.id}`);
      const deliveryAddress = addressResponse.data[0];

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = totalAmount * 0.1;
      const finalAmount = totalAmount + tax;

      const newOrder = {
        id: Math.random().toString(36).substr(2, 4),
        userId: currentUser.id,
        items: cartItems,
        totalAmount: finalAmount,
        paymentMethod: paymentMethod,
        paymentId: paymentMethod === 'card' ? selectedCard.id : `upi_${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: 'Confirmed',
        deliveryAddress
      };

      await axios.post('http://localhost:5000/orders', newOrder);
      localStorage.removeItem('cartItems');
      
      alert('Payment successful! Your order is on the way. Estimated delivery time: 30-45 minutes');
      navigate('/home');
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Payment Method Selection */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b pb-4">
              <button
                className={`px-6 py-2 rounded-lg ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Card Payment
              </button>
              <button
                className={`px-6 py-2 rounded-lg ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                📱 UPI Payment
              </button>
            </div>
          </div>

          {/* Card Payment Section */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedCard?.id === card.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Card ending in {card.cardNumber.slice(-4)}</p>
                      <p className="text-gray-600">{card.cardHolder}</p>
                      <p className="text-gray-600">Expires: {card.expiryDate}</p>
                    </div>
                    <input
                      type="radio"
                      checked={selectedCard?.id === card.id}
                      onChange={() => setSelectedCard(card)}
                      className="h-5 w-5 text-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* UPI Payment Section */}
          {paymentMethod === 'upi' && (
            <div className="text-center space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-lg font-semibold mb-4">Scan QR Code to Pay</p>
                <div className="flex justify-center mb-4">
                  <img
                    src="/api/placeholder/200/200"
                    alt="QR Code"
                    className="border p-2 rounded"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Open your UPI app and scan this code to complete the payment
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 space-x-4">
            <button
              onClick={() => navigate('/order-confirm')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={loading || (paymentMethod === 'card' && !selectedCard)}
              className={`px-4 py-2 rounded text-white ${
                loading || (paymentMethod === 'card' && !selectedCard)
                  ? 'bg-gray-400'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
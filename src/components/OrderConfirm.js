import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirm = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);

    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(cartTotal);
  }, []);

  const removeItem = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));

    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <div className="flex-none bg-slate-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/home')}>
            React Food Order Project
          </div>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/order-tracking')} className="p-2">📍</button>
            <button onClick={() => navigate('/settings')} className="p-2">⚙️</button>
            <button onClick={() => {
              localStorage.removeItem('cartItems');
              navigate('/login');
            }} className="p-2">🚪</button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cart Items Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Current Cart</h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img
                      src={item.imageURL}
                      alt={item.dishName}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.dishName}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p>Base price: ${item.cost}</p>
                          <p>Qty: {item.quantity}</p>
                          <p>Item Total: ${(item.cost * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Review Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Review Order</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>-</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Order Total</span>
                      <span>${(total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/payment')}
                  className="w-full mt-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={cartItems.length === 0}
                >
                  Checkout / Place Order
                </button>

                <div className="space-y-4 mt-6">
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Add Address
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Add Payment Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none bg-slate-700 text-white p-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>@React Food Order Project | DATE: {new Date().toLocaleDateString()} | TIME: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;
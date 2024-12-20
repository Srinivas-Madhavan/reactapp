// src/components/Order/OrderTracking.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageLayout, Card, Input } from './Layout/PageLayout';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/orders?userId=${currentUser.id}`);
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      case 'confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Order Tracking">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600 font-medium">Loading orders...</div>
        </div>
      </PageLayout>
    );
  }

  const content = (
    <>
      {error && (
        <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Card className="mb-6">
        <Input
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Card>

      {filteredOrders.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-lg text-center">No orders found</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4 text-gray-800">Order ID</th>
                  <th className="p-4 text-gray-800">Order Date</th>
                  <th className="p-4 text-gray-800">Status</th>
                  <th className="p-4 text-gray-800">Total Amount</th>
                  <th className="p-4 text-gray-800">Delivery Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{order.id}</td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                      {order.deliveryAddress.state} {order.deliveryAddress.zipCode},{' '}
                      {order.deliveryAddress.country}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );

  return (
    <PageLayout title="Order Tracking">
      {content}
    </PageLayout>
  );
};

export default OrderTracking;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [newAddressData, setNewAddressData] = useState({
    userId: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const [newPaymentData, setNewPaymentData] = useState({
    userId: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get("http://localhost:5000/users");
        const currentUser = userResponse.data[0]; // Assuming first user is logged in
        
        if (currentUser) {
          setUserData(currentUser);
          setProfileData({
            firstName: currentUser.firstName || "",
            lastName: currentUser.lastName || "",
            email: currentUser.email || "",
            password: currentUser.password || ""
          });

          // Fetch address data for current user
          const addressResponse = await axios.get(`http://localhost:5000/address?userId=${currentUser.id}`);
          const userAddress = addressResponse.data[0];
          setAddressData(userAddress);
          if (userAddress) {
            setNewAddressData(userAddress);
          } else {
            setNewAddressData(prev => ({ ...prev, userId: currentUser.id }));
          }

          // Fetch payment data for current user
          const paymentResponse = await axios.get(`http://localhost:5000/paymentDetails?userId=${currentUser.id}`);
          const userPayment = paymentResponse.data[0];
          setPaymentData(userPayment);
          if (userPayment) {
            setNewPaymentData(userPayment);
          } else {
            setNewPaymentData(prev => ({ ...prev, userId: currentUser.id }));
          }
        }
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Update user profile
      const userResponse = await axios.put(
        `http://localhost:5000/users/${userData.id}`,
        profileData
      );
      setUserData(userResponse.data);
  
      // Handle address
      let updatedAddress;
      if (addressData) {
        // Update existing address
        updatedAddress = await axios.put(
          `http://localhost:5000/address/${addressData.id}`,
          newAddressData
        );
        setAddressData(updatedAddress.data);
      } else {
        // Create new address
        updatedAddress = await axios.post(
          'http://localhost:5000/address',
          newAddressData
        );
        setAddressData(updatedAddress.data);
      }
  
      // Handle payment
      let updatedPayment;
      if (paymentData) {
        // Update existing payment
        updatedPayment = await axios.put(
          `http://localhost:5000/paymentDetails/${paymentData.id}`,
          newPaymentData
        );
        setPaymentData(updatedPayment.data);
      } else {
        // Create new payment
        updatedPayment = await axios.post(
          'http://localhost:5000/paymentDetails',
          newPaymentData
        );
        setPaymentData(updatedPayment.data);
      }
  
      setIsEditMode(false);
      setError("");
      alert("Changes saved successfully!");
    } catch (error) {
      setError("Error saving data");
      console.error("Error saving data:", error);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-4">
      {isEditMode ? (
        <>
          <div>
            <label className="block text-gray-700 mb-2">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </>
      ) : (
        <>
          <p className="py-2"><strong>First Name:</strong> {profileData.firstName}</p>
          <p className="py-2"><strong>Last Name:</strong> {profileData.lastName}</p>
          <p className="py-2"><strong>Email:</strong> {profileData.email}</p>
          <p className="py-2"><strong>Password:</strong> ********</p>
        </>
      )}
    </div>
  );

  const renderAddressTab = () => (
    <div className="space-y-4">
      {isEditMode ? (
        <>
          <div>
            <label className="block text-gray-700 mb-2">Street Address:</label>
            <input
              type="text"
              name="street"
              value={newAddressData.street}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">City:</label>
            <input
              type="text"
              name="city"
              value={newAddressData.city}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">State:</label>
            <input
              type="text"
              name="state"
              value={newAddressData.state}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">ZIP Code:</label>
            <input
              type="text"
              name="zipCode"
              value={newAddressData.zipCode}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Country:</label>
            <input
              type="text"
              name="country"
              value={newAddressData.country}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </>
      ) : (
        <>
          <p className="py-2"><strong>Street:</strong> {addressData?.street || 'Not set'}</p>
          <p className="py-2"><strong>City:</strong> {addressData?.city || 'Not set'}</p>
          <p className="py-2"><strong>State:</strong> {addressData?.state || 'Not set'}</p>
          <p className="py-2"><strong>ZIP Code:</strong> {addressData?.zipCode || 'Not set'}</p>
          <p className="py-2"><strong>Country:</strong> {addressData?.country || 'Not set'}</p>
        </>
      )}
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-4">
      {isEditMode ? (
        <>
          <div>
            <label className="block text-gray-700 mb-2">Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              value={newPaymentData.cardNumber}
              onChange={handlePaymentChange}
              className="w-full px-3 py-2 border rounded"
              maxLength="16"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Card Holder Name:</label>
            <input
              type="text"
              name="cardHolder"
              value={newPaymentData.cardHolder}
              onChange={handlePaymentChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Expiry Date:</label>
            <input
              type="text"
              name="expiryDate"
              value={newPaymentData.expiryDate}
              onChange={handlePaymentChange}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border rounded"
              maxLength="5"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">CVV:</label>
            <input
              type="password"
              name="cvv"
              value={newPaymentData.cvv}
              onChange={handlePaymentChange}
              className="w-full px-3 py-2 border rounded"
              maxLength="3"
            />
          </div>
        </>
      ) : (
        <>
          <p className="py-2"><strong>Card Number:</strong> {paymentData?.cardNumber ? '****' + paymentData.cardNumber.slice(-4) : 'Not set'}</p>
          <p className="py-2"><strong>Card Holder:</strong> {paymentData?.cardHolder || 'Not set'}</p>
          <p className="py-2"><strong>Expiry Date:</strong> {paymentData?.expiryDate || 'Not set'}</p>
          <p className="py-2"><strong>CVV:</strong> ***</p>
        </>
      )}
    </div>
  );

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Info</h2>
          <div className="space-x-4">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded ${
                isEditMode ? 'bg-gray-500' : 'bg-blue-500'
              } text-white`}
            >
              {isEditMode ? 'View Mode' : 'Edit Mode'}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-4 ${
                activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Add/Update Profile
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'address' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('address')}
            >
              Add/Update Address
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'payment' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('payment')}
            >
              Add/Update Payment Details
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'address' && renderAddressTab()}
          {activeTab === 'payment' && renderPaymentTab()}
        </div>

        {isEditMode && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
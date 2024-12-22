import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./../styles/settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [newAddressData, setNewAddressData] = useState({
    userId: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [newPaymentData, setNewPaymentData] = useState({
    userId: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
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
            password: currentUser.password || "",
          });

          // Fetch address data for current user
          const addressResponse = await axios.get(
            `http://localhost:5000/address?userId=${currentUser.id}`
          );
          const userAddress = addressResponse.data[0];
          setAddressData(userAddress);
          if (userAddress) {
            setNewAddressData(userAddress);
          } else {
            setNewAddressData((prev) => ({ ...prev, userId: currentUser.id }));
          }

          // Fetch payment data for current user
          const paymentResponse = await axios.get(
            `http://localhost:5000/paymentDetails?userId=${currentUser.id}`
          );
          const userPayment = paymentResponse.data[0];
          setPaymentData(userPayment);
          if (userPayment) {
            setNewPaymentData(userPayment);
          } else {
            setNewPaymentData((prev) => ({ ...prev, userId: currentUser.id }));
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
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentData((prev) => ({
      ...prev,
      [name]: value,
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
          "http://localhost:5000/address",
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
          "http://localhost:5000/paymentDetails",
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
    <div className={classes.content}>
      {isEditMode ? (
        <div className={classes.inputs}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleProfileChange}
            />
          </div>
        </div>
      ) : (
        <>
          <p>
            <strong>First Name:</strong> {profileData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {profileData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
        </>
      )}
    </div>
  );

  const renderAddressTab = () => (
    <div className={classes.content}>
      {isEditMode ? (
        <div div className={classes.inputs}>
          <div>
            <label>Street Address:</label>
            <input
              type="text"
              name="street"
              value={newAddressData.street}
              onChange={handleAddressChange}
            />
          </div>

          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={newAddressData.city}
              onChange={handleAddressChange}
            />
          </div>

          <div>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={newAddressData.state}
              onChange={handleAddressChange}
            />
          </div>

          <div>
            <label>ZIP Code:</label>
            <input
              type="text"
              name="zipCode"
              value={newAddressData.zipCode}
              onChange={handleAddressChange}
            />
          </div>

          <div>
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={newAddressData.country}
              onChange={handleAddressChange}
            />
          </div>
        </div>
      ) : (
        <>
          <p>
            <strong>Street:</strong> {addressData?.street || "Not set"}
          </p>
          <p>
            <strong>City:</strong> {addressData?.city || "Not set"}
          </p>
          <p>
            <strong>State:</strong> {addressData?.state || "Not set"}
          </p>
          <p>
            <strong>ZIP Code:</strong> {addressData?.zipCode || "Not set"}
          </p>
          <p>
            <strong>Country:</strong> {addressData?.country || "Not set"}
          </p>
        </>
      )}
    </div>
  );

  const renderPaymentTab = () => (
    <div className={classes.content}>
      {isEditMode ? (
        <div div className={classes.inputs}>
          <div>
            <label>Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              value={newPaymentData.cardNumber}
              onChange={handlePaymentChange}
              maxLength="16"
            />
          </div>

          <div>
            <label>Card Holder Name:</label>
            <input
              type="text"
              name="cardHolder"
              value={newPaymentData.cardHolder}
              onChange={handlePaymentChange}
            />
          </div>

          <div>
            <label>Expiry Date:</label>
            <input
              type="text"
              name="expiryDate"
              value={newPaymentData.expiryDate}
              onChange={handlePaymentChange}
              placeholder="MM/YY"
              maxLength="5"
            />
          </div>

          <div>
            <label>CVV:</label>
            <input
              type="password"
              name="cvv"
              value={newPaymentData.cvv}
              onChange={handlePaymentChange}
              maxLength="3"
            />
          </div>
        </div>
      ) : (
        <>
          <p>
            <strong>Card Number:</strong>{" "}
            {paymentData?.cardNumber
              ? "****" + paymentData.cardNumber.slice(-4)
              : "Not set"}
          </p>
          <p>
            <strong>Card Holder:</strong> {paymentData?.cardHolder || "Not set"}
          </p>
          <p>
            <strong>Expiry Date:</strong> {paymentData?.expiryDate || "Not set"}
          </p>
        </>
      )}
    </div>
  );

  if (!userData) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <header>
        <p className={classes.header}>Food ordering app</p>
        <div className={classes.headerComponent}>
          <button onClick={() => navigate("/home")} variant="outlined">
            HOME
          </button>
          <button onClick={() => navigate("/order-confirm")} variant="outlined">
            ORDER-CONFIRM
          </button>
          <button
            onClick={() => navigate("/order-tracking")}
            variant="outlined"
          >
            ORDER-TRACKING
          </button>
          <button onClick={() => navigate("/")} variant="outlined">
            LOGOUT
          </button>
        </div>
      </header>
      <div className={classes.container}>
        <div className={classes.information}>
          <div>
            <div className={classes.head}></div>
            <div className={classes.body}></div>
          </div>
          <p className={classes.name}>
            {profileData.firstName} {profileData.lastName}
          </p>
          {/* <button onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? "View Mode" : "Edit Mode"}
            </button> */}
        </div>

        {error && <p>{error}</p>}

        <div className={classes.outputContainer}>
          <div className={classes.outputHeader}>
            <p className={classes.info}>{isEditMode ? "Edit Mode" : "View Mode"}</p>
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="xl"
              className={classes.icon}
              onClick={() => setIsEditMode(!isEditMode)}
            />
          </div>
          <div className={classes.outputButtons}>
            <button onClick={() => setActiveTab("profile")} className={activeTab == "profile" ? classes.active : null}>
              Add/Update Profile
            </button>
            <button onClick={() => setActiveTab("address")} className={activeTab == "address" ? classes.active : null}>
              Add/Update Address
            </button>
            <button onClick={() => setActiveTab("payment")} className={activeTab == "payment" ? classes.active : null}>
              Add/Update Payment Details
            </button>
          </div>
          <div>
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "address" && renderAddressTab()}
            {activeTab === "payment" && renderPaymentTab()}
          </div>
          {isEditMode && (
            <div className={classes.saveButton}>
              <button onClick={() => setIsEditMode(false)}>Cancel</button>
              <button onClick={handleSave}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import ForgotPassword from './components/ForgotPassword.js';
import OrderConfirm from './components/OrderConfirm.js';
import Settings from "./components/Settings.js";
import Payment from './components/Payment.js';
import OrderTracking from './components/OrderTracking.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-tracking" element={<OrderTracking />} />

      </Routes>
    </Router>
  );
}

export default App;
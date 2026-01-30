import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Plans from './pages/Plans';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Recharge from './pages/Recharge';
import Legal from './pages/Legal';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRechargeConfig from './pages/AdminRechargeConfig';

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <div className="main-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/recharge-config" element={<AdminRechargeConfig />} />
        </Routes>
      </div>
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
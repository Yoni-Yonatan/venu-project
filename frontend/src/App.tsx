import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Sell } from './pages/Sell';
import { ItemDetails } from './pages/ItemDetails';
import { SellerProfile } from './pages/SellerProfile';
import { AdminVerify } from './pages/AdminVerify';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { RegisterChoice } from './pages/RegisterChoice';
import { RegisterBuyer } from './pages/RegisterBuyer';
import { RegisterSeller } from './pages/RegisterSeller';
import { PendingVerification } from './pages/PendingVerification';
import { useStore } from './store/useStore';
import { ChatWindow } from './components/ChatWindow';

// Login Page
const Login = () => {
  const { login } = useStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-black text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">Don't have an account? </span>
          <a href="/register" className="text-sm font-semibold text-black hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};


const Profile = () => (
  <div className="min-h-screen flex items-center justify-center pt-20 text-center text-gray-500">
    Profile & Verification Page (Coming Soon)
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col text-gray-900 font-sans">
        <Navbar />
        <div className="flex-1 pt-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterChoice />} />
            <Route path="/register-buyer" element={<RegisterBuyer />} />
            <Route path="/register-seller" element={<RegisterSeller />} />
            <Route path="/pending-verification" element={<PendingVerification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            {/* Legal Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <ChatWindow />
      </div>
    </Router>
  );
}

export default App;

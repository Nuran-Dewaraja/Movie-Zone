import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE = 'https://localhost:7290/api/Auth';

// Login API call
const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Signup API call
const signup = async (name, email, password) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: name,
      email,
      password,
      createdBy: name,
    }),
  });
  return response.json();
};

const LoginSignupPages = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        Swal.fire('Error', 'Please enter email and password.', 'error');
        return;
      }
      setLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          await Swal.fire('Success', 'Login successful!', 'success');
          navigate('/');
        } else {
          Swal.fire('Error', result.message || 'Login failed.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Login error, please try again.', 'error');
      }
      setLoading(false);
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        Swal.fire('Error', 'Please fill all fields.', 'error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Swal.fire('Error', 'Passwords do not match.', 'error');
        return;
      }
      setLoading(true);
      try {
        const result = await signup(formData.name, formData.email, formData.password);
        if (result.message?.toLowerCase().includes('success')) {
          await Swal.fire('Success', 'Signup successful! You can now login.', 'success');
          setIsLogin(true);
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
          });
          navigate('/login');
        } else {
          Swal.fire('Error', result.message || 'Signup failed.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Signup error, please try again.', 'error');
      }
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white mb-2">🎬 MovieZone</div>
          <h2 className="text-2xl font-semibold text-white">
            {isLogin ? 'Welcome Back!' : 'Join MovieZone'}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 space-y-6"
        >
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-green-400 hover:text-green-300">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-green-400 hover:text-green-300 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
          <a href="#" className="text-green-400 hover:text-green-300">Terms of Service</a> and{' '}
          <a href="#" className="text-green-400 hover:text-green-300">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPages;

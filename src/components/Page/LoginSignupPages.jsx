import React, { useState } from 'react';

// API base URL
const API_BASE = 'http://localhost:4000';

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
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

const LoginSignupPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (isLogin) {
      // Login flow
      if (!formData.email || !formData.password) {
        setMessage('Please enter email and password.');
        return;
      }
      setLoading(true);
      try {
        const result = await login(formData.email, formData.password);
        if (result.token) {
          setMessage('Login successful!');
          // Save token to localStorage or context for future requests
          localStorage.setItem('token', result.token);
          // You can redirect or load user profile here
        } else {
          setMessage(result.message || 'Login failed.');
        }
      } catch (error) {
        setMessage('Login error, please try again.');
      }
      setLoading(false);
    } else {
      // Signup flow
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setMessage('Please fill all fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        const result = await signup(formData.name, formData.email, formData.password);
        if (result.message === 'User registered successfully') {
          setMessage('Signup successful! You can now login.');
          setIsLogin(true);
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
          });
        } else {
          setMessage(result.message || 'Signup failed.');
        }
      } catch (error) {
        setMessage('Signup error, please try again.');
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
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white mb-2">🎬 MovieZone</div>
          <h2 className="text-2xl font-semibold text-white">
            {isLogin ? 'Welcome Back!' : 'Join MovieZone'}
          </h2>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 space-y-6"
        >
          {/* Show message */}
          {message && (
            <div
              className={`p-3 rounded text-center ${
                message.toLowerCase().includes('success') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {message}
            </div>
          )}

          {/* Name field (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password field (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Forgot Password (login only) */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle between login/signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
          <a href="#" className="text-green-400 hover:text-green-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-green-400 hover:text-green-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPages;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../features/User/UserSlice';
import { useNavigate } from 'react-router-dom';
import './Signin.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.data;
      navigate('/')
      localStorage.setItem('email', formData.email)
      localStorage.setItem('userId', result.Id)
      dispatch(setUser({ userId: result.Id, email: formData.email }));
      dispatch(login())
      setSuccess(true)
      toast('Login Successfull', result.email)
    } catch (error) {
      if (error.response) {
        const contentType = error.response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          setErrors({ general: error.response.data.msg ?? JSON.stringify(error.response.data) });
        } else {
          setErrors({ general: error.response.statusText || String(error.response.data) });
        }
      } else if (error.request) {
        setErrors({ general: 'No response received from server' });
      } else {
        setErrors({ general: error.msg });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="signin-container">
      <ToastContainer />
      <div className="signin-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        {success && (
          <div className="success-message">
            ✓ Login successful! Redirecting...
          </div>
        )}

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;

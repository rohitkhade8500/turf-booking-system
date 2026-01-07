import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://turf-booking-api-nnrq.onrender.com/api/auth/login', formData);
      
      // SAVE TOKEN AND ROLE
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); // <--- NEW LINE
      localStorage.setItem('name', res.data.user.name); // <--- NEW LINE

      alert('Login Successful!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
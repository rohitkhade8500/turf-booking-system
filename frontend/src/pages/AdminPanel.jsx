import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    location: '',
    pricePerHour: '',
    slots: '' // We will take comma separated string (e.g. "9-10, 10-11")
  });

  // Security Check: Kick out non-admins
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert("Access Denied: Admins Only");
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert comma-separated string to array for backend
      // Input: "09:00-10:00, 10:00-11:00" -> Output: ["09:00-10:00", "10:00-11:00"]
      const slotsArray = formData.slots.split(',').map(s => s.trim());

      await axios.post(
        'https://turf-booking-api-nnrq.onrender.com/api/turfs', 
        { ...formData, slots: slotsArray },
        { headers: { 'x-auth-token': token } }
      );

      alert('Turf Added Successfully!');
      setFormData({ name: '', sportType: '', location: '', pricePerHour: '', slots: '' }); // Reset form
    } catch (err) {
      console.error(err);
      alert('Failed to add turf');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Panel: Add Turf</h2>
      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Turf Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Sport Type</label>
              <select name="sportType" value={formData.sportType} onChange={handleChange} className="form-select" required>
                <option value="">Select Sport</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Badminton">Badminton</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Price Per Hour (₹)</label>
              <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="form-control" required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Available Slots (Comma Separated)</label>
            <input 
              type="text" 
              name="slots" 
              value={formData.slots} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="e.g. 09:00-10:00, 10:00-11:00, 16:00-17:00" 
              required 
            />
            <small className="text-muted">Enter time slots separated by commas</small>
          </div>

          <button type="submit" className="btn btn-danger w-100">Add Turf</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
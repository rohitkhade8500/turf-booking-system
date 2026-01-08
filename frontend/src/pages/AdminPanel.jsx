import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', sportType: '', location: '', pricePerHour: '', slots: ''
  });
  const [allBookings, setAllBookings] = useState([]);

  // 1. Fetch Bookings on Load
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert("Access Denied");
      navigate('/');
    } else {
      fetchAllBookings();
    }
  }, [navigate]);

  const fetchAllBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      setAllBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slotsArray = formData.slots.split(',').map(s => s.trim());
      await api.post('/turfs', { ...formData, slots: slotsArray });
      alert('Turf Added Successfully!');
      setFormData({ name: '', sportType: '', location: '', pricePerHour: '', slots: '' });
    } catch (err) {
      alert('Failed to add turf');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">⚙️ Admin Dashboard</h2>
      
      <div className="row">
        {/* LEFT COLUMN: Add Turf Form */}
        <div className="col-md-4 mb-4">
          <div className="card shadow p-3">
            <h4 className="mb-3">Add New Turf</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input type="text" name="name" placeholder="Turf Name" value={formData.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <select name="sportType" value={formData.sportType} onChange={handleChange} className="form-select" required>
                  <option value="">Select Sport</option>
                  <option value="Football">Football</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Badminton">Badminton</option>
                </select>
              </div>
              <div className="mb-2">
                <input type="number" name="pricePerHour" placeholder="Price (₹)" value={formData.pricePerHour} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-2">
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <input type="text" name="slots" placeholder="Slots (e.g. 9-10, 10-11)" value={formData.slots} onChange={handleChange} className="form-control" required />
              </div>
              <button type="submit" className="btn btn-danger w-100">Add Turf</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: View All Bookings */}
        <div className="col-md-8">
          <div className="card shadow p-3">
            <h4 className="mb-3">📋 All User Bookings ({allBookings.length})</h4>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Turf</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <strong>{b.user?.name || 'Unknown'}</strong><br/>
                        <small className="text-muted">{b.user?.email}</small>
                      </td>
                      <td>{b.turf?.name || 'Deleted Turf'}</td>
                      <td>{b.date}</td>
                      <td><span className="badge bg-info text-dark">{b.slot}</span></td>
                      <td>₹{b.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
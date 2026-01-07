import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      
      // If not logged in, kick them out
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { 'x-auth-token': token }
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        // If token is invalid (expired), redirect to login
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Dashboard</h2>
      
      {bookings.length === 0 ? (
        <div className="alert alert-info">
          You haven't booked any turfs yet. <a href="/">Go book one!</a>
        </div>
      ) : (
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Booking History</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>Turf Name</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      {/* We use ?. in case turf was deleted to prevent crash */}
                      <td>{booking.turf?.name || 'Unknown Turf'}</td>
                      <td>{booking.date}</td>
                      <td>{booking.slot}</td>
                      <td>₹{booking.totalPrice}</td>
                      <td>
                        <span className="badge bg-success">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
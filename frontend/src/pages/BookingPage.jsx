import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const { id } = useParams(); // Get turf ID from URL
  const navigate = useNavigate();
  
  const [turf, setTurf] = useState(null);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // Fetch Turf Details
    const fetchTurf = async () => {
      try {
        const res = await axios.get(`https://turf-booking-api-nnrq.onrender.com/api/turfs/${id}`);
        setTurf(res.data);
      } catch (err) {
        console.error("Error fetching turf:", err);
      }
    };
    fetchTurf();
  }, [id]);

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to book a turf!");
      navigate('/login');
      return;
    }

    // 🛡️ FIND THE PRICE (Supports both naming conventions)
    const priceToSend = turf.pricePerHour || turf.price || 0;

    console.log("Sending Booking Data:", {
        turfId: id,
        date: date,
        slot: selectedSlot,
        price: priceToSend
    });

    try {
      await axios.post(
        'https://turf-booking-api-nnrq.onrender.com/api/bookings',
        {
          turfId: id,
          date: date,
          slot: selectedSlot,
          price: priceToSend // ✅ CRITICAL FIX: Sending the price!
        },
        { headers: { 'x-auth-token': token } } // Sending token for auth
      );
      
      alert('Booking Confirmed! 🎉');
      navigate('/');
      
    } catch (err) {
      console.error("Booking Error:", err);
      // Show the specific error message from the backend
      const msg = err.response?.data?.message || 'Booking Failed';
      alert(`❌ Error: ${msg}`);
    }
  };

  if (!turf) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-3">{turf.name}</h2>
        <h5 className="text-muted">{turf.location} - ₹{turf.pricePerHour || turf.price}/hr</h5>
        <hr />

        <div className="mb-4">
            <label className="form-label fw-bold">Select Date:</label>
            <input 
                type="date" 
                className="form-control w-50" 
                onChange={(e) => setDate(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label className="form-label fw-bold">Select Time Slot:</label>
            <div className="d-flex flex-wrap gap-2">
                {turf.slots && turf.slots.map((slot, index) => (
                    <button 
                        key={index} 
                        className={`btn ${selectedSlot === slot ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => setSelectedSlot(slot)}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        </div>

        <button 
            className="btn btn-dark btn-lg w-100" 
            onClick={handleBook}
            disabled={!date || !selectedSlot}
        >
            Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
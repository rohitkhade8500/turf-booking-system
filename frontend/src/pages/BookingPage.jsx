import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // ✅ Uses the cleaner API config

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
        const res = await api.get(`/turfs/${id}`);
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

    if (!date || !selectedSlot) {
      alert("Please select a Date and a Time Slot");
      return;
    }

    try {
      // ✅ FIX: Added 'price' here because Backend requires it
      const bookingPayload = {
        turfId: id,
        date: date,
        slot: selectedSlot,
        price: turf.pricePerHour // <--- This was missing before!
      };

      await api.post('/bookings', bookingPayload);
      
      alert('✅ Booking Confirmed! 🎉');
      navigate('/dashboard');
    } catch (err) {
      // Show the specific error message from backend
      const errorMsg = err.response?.data?.message || 'Booking Failed';
      alert(`❌ Error: ${errorMsg}`);
    }
  };

  if (!turf) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-3">{turf.name}</h2>
        <h5 className="text-muted">{turf.location} - <span className="text-success fw-bold">₹{turf.pricePerHour}/hr</span></h5>
        <hr />

        <div className="mb-4">
            <label className="form-label fw-bold">Select Date:</label>
            <input 
                type="date" 
                className="form-control w-50" 
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
            />
        </div>

        <div className="mb-4">
            <label className="form-label fw-bold">Select Time Slot:</label>
            <div className="d-flex flex-wrap gap-2">
                {turf.slots.map((slot, index) => (
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
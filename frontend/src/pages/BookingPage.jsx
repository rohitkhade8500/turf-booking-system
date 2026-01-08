import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [turf, setTurf] = useState(null);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const res = await api.get(`/turfs/${id}`);
        setTurf(res.data);
        // Debug: Check what the turf object actually looks like
        console.log("Fetched Turf Data:", res.data); 
      } catch (err) {
        console.error("Error fetching turf:", err);
      }
    };
    fetchTurf();
  }, [id]);

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    // 1. SAFEGUARD: Get price, handling possible naming differences
    // Some databases save it as 'price', some as 'pricePerHour'
    const finalPrice = turf.pricePerHour || turf.price || 0;

    console.log("Attempting Booking with:", {
      turfId: id,
      date,
      slot: selectedSlot,
      price: finalPrice
    });

    if (!id || !date || !selectedSlot || !finalPrice) {
      alert(`⚠️ STOP! Missing Data.\nPrice found: ${finalPrice}`);
      return;
    }

    try {
      const bookingPayload = {
        turfId: id,
        date: date,
        slot: selectedSlot,
        price: finalPrice // Sending the safe price
      };

      await api.post('/bookings', bookingPayload);
      
      alert('✅ Booking Confirmed! 🎉');
      navigate('/dashboard');
    } catch (err) {
      console.error("Booking Error Response:", err.response);
      const errorMsg = err.response?.data?.message || 'Booking Failed';
      alert(`❌ Backend Error: ${errorMsg}`);
    }
  };

  if (!turf) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-3">{turf.name}</h2>
        <h5 className="text-muted">{turf.location} - <span className="text-success fw-bold">₹{turf.pricePerHour || turf.price}/hr</span></h5>
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
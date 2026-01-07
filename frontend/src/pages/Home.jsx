import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. A pool of different high-quality sports images
const turfImages = [
  "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Football
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Cricket/Baseball field
  "https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Football Night
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Futsal Indoor
  "https://images.unsplash.com/photo-1587385789097-0197a7fbd179?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Cricket Nets
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"  // Soccer Field
];

const Home = () => {
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/turfs');
        setTurfs(res.data);
      } catch (err) {
        console.error("Error fetching turfs:", err);
      }
    };
    fetchTurfs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold">Available Sports Turfs</h2>
      <div className="row">
        {turfs.map((turf, index) => (
          <div className="col-md-4 mb-4" key={turf._id}>
            <div className="card shadow-sm h-100 border-0">
              
              {/* 2. LOGIC: Cycle through images based on the index */}
              {/* Index 0 gets Image 0, Index 1 gets Image 1... Index 6 gets Image 0 again */}
              <img 
                src={turfImages[index % turfImages.length]} 
                className="card-img-top" 
                alt="Turf" 
                style={{ height: '220px', objectFit: 'cover' }} // Made slightly taller for better look
              />
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{turf.name}</h5>
                <p className="card-text text-secondary">
                  <strong>📍 Location:</strong> {turf.location} <br />
                  <strong>⚽ Sport:</strong> {turf.sportType} <br />
                  <strong>💰 Price:</strong> ₹{turf.pricePerHour}/hr
                </p>
                
                <Link to={`/book/${turf._id}`} className="btn btn-success w-100 mt-auto fw-bold shadow-sm">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
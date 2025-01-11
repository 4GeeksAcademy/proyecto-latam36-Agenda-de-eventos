import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Carrusel.css";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  const fetchTopFavorites = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: "approved"
      });
      
      const response = await fetch(`${backend}/api/events/top_favorites?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error fetching top favorite events");
      }
      const events = await response.json();
      
      const approvedEvents = events.filter(event => event.status === "approved");
      
      const sortedEvents = approvedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setTopEvents(sortedEvents);
    } catch (err) {
      console.error("Error fetching top favorite events:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopFavorites();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % topEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [topEvents]);

  const showSlide = (index) => {
    if (index >= topEvents.length) {
      setCurrentSlide(0);
    } else if (index < 0) {
      setCurrentSlide(topEvents.length - 1);
    } else {
      setCurrentSlide(index);
    }
  };

  const goToEventDetails = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  if (loading) {
    return (
      <div className="carousel-wrapper">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-wrapper">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (topEvents.length === 0) {
    return (
      <div className="carousel-wrapper">
        <div className="no-events-message">No popular events available.</div>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <div className="carousel" style={{ transform: `translateX(${-currentSlide * 100}%)` }}>
          {topEvents.map((event, index) => (
            <div 
              className="slide" 
              key={event.id || index}
              onClick={() => goToEventDetails(event.id)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={event.flyer_img_url || "https://via.placeholder.com/800x400?text=No+Image"}
                alt={event.event_name}
              />
            </div>
          ))}
        </div>
        <button className="prev" onClick={() => showSlide(currentSlide - 1)}>
          ❮
        </button>
        <button className="next" onClick={() => showSlide(currentSlide + 1)}>
          ❯
        </button>
      </div>
    </div>
  );
};

export default Carousel;
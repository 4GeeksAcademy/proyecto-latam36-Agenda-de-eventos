import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  // Fetch top favorite events
  const fetchTopFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backend}/api/events/top_favorites`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error fetching top favorite events");
      }
      const events = await response.json();
      setTopEvents(events);
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

  const showSlide = (index) => {
    if (index >= topEvents.length) {
      setCurrentSlide(0);
    } else if (index < 0) {
      setCurrentSlide(topEvents.length - 1);
    } else {
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  const goToEventDetails = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (topEvents.length === 0) {
    return <div>No popular events available.</div>;
  }

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <div className="carousel">
          <div className="slides" style={{ transform: `translateX(${-currentSlide * 100}%)` }}>
            {topEvents.map((event, index) => (
              <div className="slide" key={index}>
                <img
                  src={event.flyer_img_url || "https://via.placeholder.com/800x400?text=No+Image"}
                  alt={event.event_name}
                  onClick={() => goToEventDetails(event.id)}
                />
                <div className="event-info">
                  <h3>{event.event_name}</h3>
                  <p>{new Date(event.event_date).toLocaleDateString("es-ES")}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="prev" onClick={prevSlide}>
            ❮
          </button>
          <button className="next" onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

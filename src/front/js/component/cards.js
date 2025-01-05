import React, { useEffect, useState, useRef } from "react";
import "../../styles/cards.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext } from "react";
import { Context } from "../store/appContext";

const AutoScrollGallery = () => {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]); 
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEvents, setShowEvents] = useState(false); 
  const galleryRef = useRef(null);
  const { store } = useContext(Context);
  const { userCountry } = store;

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Inicia Sesión para ver los Eventos");
        }

        const API_BASE_URL = `${backend}/api/events?status=approved`;

        const response = await fetch(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Inicia Sesión para ver los Eventos");
        }

        const eventsData = await response.json();

        // Filtrar los eventos por país si userCountry está disponible
        const filteredEvents = userCountry
          ? eventsData.filter(event => {
              const eventCountry = event.location.split(",").pop().trim();
              return eventCountry === userCountry;
            })
          : eventsData;

        const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);

        setVisibleEvents(sortedEvents);
        setShowEvents(true); 
      } catch (err) {
        console.error("Error occurred during fetch:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, [userCountry]);

  const handleCardClick = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  const scroll = (direction) => {
    if (!galleryRef.current || !visibleEvents.length) return;

    const gallery = galleryRef.current;
    const cardWidth = gallery.children[0]?.offsetWidth || 0;
    const gap = 64; // 4rem gap
    const scrollAmount = cardWidth + gap;
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;

    let newScrollPosition;
    if (direction === 'right') {
      if (gallery.scrollLeft >= maxScroll - 10) {
        // Si estamos al final, volver al inicio
        newScrollPosition = 0;
      } else {
        newScrollPosition = gallery.scrollLeft + scrollAmount;
      }
    } else {
      if (gallery.scrollLeft <= 10) {
        // Si estamos al inicio, ir al final
        newScrollPosition = maxScroll;
      } else {
        newScrollPosition = gallery.scrollLeft - scrollAmount;
      }
    }

    gallery.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  const navButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
  };

  return (
    <div className="container-fluid">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="ml-4">Top Trending en {userCountry || "tu País"}</h1>

          {!isMobile && (
            <div className="d-flex gap-3 me-4">
              <button
                onClick={() => scroll('left')}
                style={navButtonStyle}
                className="hover-shadow"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scroll('right')}
                style={navButtonStyle}
                className="hover-shadow"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : !loading && showEvents && (
        <div 
          className="auto-scroll-gallery" 
          ref={galleryRef}
          style={{ scrollLeft: 0, visibility: showEvents ? "visible" : "hidden" }} 
        >
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="card text-decoration-none text-muted"
              onClick={() => handleCardClick(event.id)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <img
                src={event.flyer_img_url}
                className="card-img-top"
                alt={event.event_name}
                style={{ height: "300px", objectFit: "cover" }}
              />
              
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title text-wrap">{event.event_name}</h5>
                  <p className="card-text text-wrap">
                    {event.description || "No description available"}
                  </p>
                </div>
                <div
                  style={{
                    alignSelf: "flex-end", 
                    backgroundColor: "#f8f9fa",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    textAlign: "center",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    marginTop: "10px",
                  }}
                >
                  <small style={{ fontSize: "10px" }}>
                    {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                  </small>
                  <br />
                  <strong style={{ fontSize: "16px" }}>{new Date(event.date).getDate()}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoScrollGallery;

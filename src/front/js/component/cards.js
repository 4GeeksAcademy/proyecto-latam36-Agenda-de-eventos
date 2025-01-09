import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import { Context } from "../store/appContext";
import "../../styles/cards.css";

const AutoScrollGallery = ({ filters }) => {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef(null);
  const { store } = useContext(Context);
  const { userCountry, user } = store;

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: "approved",
        category: filters.category !== "Todos" ? filters.category : undefined,
        is_online: filters.isOnline !== null ? filters.isOnline : undefined,  
        price_type: filters.price !== "Todos" ? filters.price : undefined,  
        age_classification: filters.ageClassification !== "Todos" ? filters.ageClassification : undefined,
      });

      const API_BASE_URL = `${backend}/api/events?${queryParams.toString()}`;

      const response = await fetch(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener los eventos");
      }

      const eventsData = await response.json();
      console.log("Eventos obtenidos:", eventsData);
      const sortedEvents = eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
    } catch (err) {
      console.error("Error occurred during fetch:", err.message);
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  useEffect(() => {
    const filterAndSortEvents = () => {
      let filteredEvents = events.filter(event => event.status === "approved");

      if (filters) {
        if (filters.category && filters.category !== "Todos") {
          const categoryList = Array.isArray(filters.category) 
            ? filters.category 
            : filters.category.split(",").map(c => c.trim());
          filteredEvents = filteredEvents.filter(event => categoryList.includes(event.category));
        }

        if (filters.isOnline !== null) {
          filteredEvents = filteredEvents.filter(event => event.is_online === filters.isOnline);
        }

        if (filters.price && filters.price !== "Todos") {
          filteredEvents = filteredEvents.filter(event => {
            if (filters.price === "De Pago") {
              return event.ticket_price > 0;
            } else if (filters.price === "Gratis") {
              return event.ticket_price === 0;
            }
            return true;
          });
        }

        if (filters.ageClassification && filters.ageClassification !== "Todos") {
          filteredEvents = filteredEvents.filter(event => event.age_classification === filters.ageClassification);
        }

        if (user?.age < 18) {
          filteredEvents = filteredEvents.filter(event => event.age_classification !== "18+");
        }
      }

      const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("Eventos visibles:", sortedEvents);
      setVisibleEvents(sortedEvents);
      setShowEvents(true);
    };

    filterAndSortEvents();
  }, [events, filters, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  const scroll = (direction) => {
    if (!galleryRef.current || !visibleEvents.length) return;

    const gallery = galleryRef.current;
    const cardWidth = gallery.children[0]?.offsetWidth || 0;
    const gap = 64;
    const scrollAmount = cardWidth + gap;
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;

    let newScrollPosition;
    if (direction === 'right') {
      if (gallery.scrollLeft >= maxScroll - 10) {
        newScrollPosition = 0;
      } else {
        newScrollPosition = gallery.scrollLeft + scrollAmount;
      }
    } else {
      if (gallery.scrollLeft <= 10) {
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
    <div className="events-gallery-container">
      <div className="events-gallery-header d-flex justify-content-between align-items-center">
        {/* <h1>
          {filters?.country && filters.country !== "Todos"
            ? `Próximos Eventos en ${filters.country}`
            : "Próximos Eventos"}
        </h1> */}
        {!isMobile && (
          <div className="nav-buttons">
            <button
              onClick={() => scroll('left')}
              className="nav-button"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll('right')}
              className="nav-button"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading || !showEvents ? (
        <div className="auto-scroll-gallery" ref={galleryRef}>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div 
          className="auto-scroll-gallery" 
          ref={galleryRef}
          style={{ visibility: showEvents ? "visible" : "hidden" }}
        >
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event) => (
              <div
                key={event.id}
                className="event-card"
                onClick={() => handleCardClick(event.id)}
              >
                <div className="event-card-image">
                  <img
                    src={event.flyer_img_url || "https://via.placeholder.com/600x400?text=Event+Image"}
                    alt={event.event_name || "Placeholder image"}
                  />
                  <div className="category-badge">
                    {event.category}
                  </div>
                </div>
                
                <div className="event-card-content">
                  <h3 className="event-title">{event.event_name}</h3>
                  
                  <div className="event-info">
                    <div className="location-info">
                      <FaMapMarkerAlt />
                      <div className="location-text">
                        {event.location.split(',')[0]}<br />
                        <strong>{event.location.split(',').pop().trim()}</strong>
                      </div>
                    </div>
                    
                    <div className="date-badge">
                      <div className="date-month">
                        {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                      </div>
                      <div className="date-day">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="date-time">
                        {new Date(event.date).toLocaleString("default", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events-message">
              <h2>No hay eventos disponibles para este filtro</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoScrollGallery;
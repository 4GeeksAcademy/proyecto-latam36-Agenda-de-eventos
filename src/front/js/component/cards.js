import React, { useEffect, useState, useRef } from "react";
import "../../styles/cards.css";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from "react-icons/fa";
import { useContext } from "react";
import { Context } from "../store/appContext";

const AutoScrollGallery = ({ filters }) => {
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const galleryRef = useRef(null);
  const { store } = useContext(Context);
  const { userCountry, token } = store;

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let API_BASE_URL = `${backend}/api/events/filter?`;

        // Si hay filtros, se usan
        if (filters) {
          if (filters.country && filters.country !== "Todos") {
            API_BASE_URL += `country=${filters.country}&`;
          }
          if (filters.category && filters.category !== "Todos") {
            API_BASE_URL += `category=${filters.category}&`;
          }
          if (filters.isOnline !== null) {
            API_BASE_URL += `isOnline=${filters.isOnline}&`;
          }
          if (filters.price && filters.price !== "Todos") {
            API_BASE_URL += `price=${filters.price}&`;
          }
        } 
        // Si no hay filtros pero hay un usuario logueado, se usa userCountry
        else if (token && userCountry) {
          API_BASE_URL += `country=${userCountry}`;
        }
        // Si no hay filtros ni usuario, muestra todos los eventos

        const response = await fetch(API_BASE_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar los Eventos");
        }

        const eventsData = await response.json();
        setEvents(eventsData);
      } catch (err) {
        console.error("Error occurred during fetch:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters, userCountry, token, backend]);

  useEffect(() => {
    const filterAndSortEvents = () => {
      let filteredEvents = events;

      // Solo aplica filtros adicionales si se proporcionaron filtros
      if (filters) {
        const country = filters.country || (token && userCountry);
        if (country && country !== "Todos") {
          filteredEvents = filteredEvents.filter(event => {
            const eventCountry = event.location.split(",").pop().trim();
            return eventCountry === country;
          });
        }

        if (filters.category && filters.category !== "Todos") {
          filteredEvents = filteredEvents.filter(event => event.category === filters.category);
        }

        if (filters.isOnline !== null) {
          filteredEvents = filteredEvents.filter(event => event.isOnline === filters.isOnline);
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
      }

      const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      setVisibleEvents(sortedEvents);
      setShowEvents(true);
    };

    filterAndSortEvents();
  }, [events, filters, userCountry, token]);

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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="ml-4">
          {
            filters?.country && filters.country !== "Todos"

            ? `Próximos Eventos en ${filters.country}`
            : token
            ? `Próximos Eventos en ${userCountry}`
            : "Próximos Eventos"
        }
      </h1>
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
    {error ? (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    ) : loading || !showEvents ? (
      <div 
        className="auto-scroll-gallery" 
        ref={galleryRef}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }} 
      >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      <div 
        className="auto-scroll-gallery" 
        ref={galleryRef}
        style={{ scrollLeft: 0, visibility: showEvents ? "visible" : "hidden", minHeight: '400px' }} 
      >
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => (
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
                  <p className="card-text text-wrap">
                    {event.category}
                  </p>
                  <h5 className="card-title text-wrap">{event.event_name}</h5>
                </div>
                <div 
                  className="d-flex justify-content-between align-items-center"
                  style={{ marginTop: "10px" }}
                >
                  <div className="text-start">
                    <FaMapMarkerAlt style={{ marginRight: "5px" }} />
                    <div>
                      {event.location.split(',')[0]}<br />
                      <strong>{event.location.split(',').pop().trim()}</strong>
                    </div>
                  </div>
                  <div className="text-center date-container" style={{ backgroundColor: "#f8f9fa", padding: "5px 10px", borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}>
                    <small style={{ fontSize: "10px" }}>
                      {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                    </small>
                    <br />
                    <strong style={{ fontSize: "16px" }}>{new Date(event.date).getDate()}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events" style={{ textAlign: 'center', marginTop: '150px' }}>
            <h2>No hay eventos disponibles para este filtro</h2>
          </div>
        )}
      </div>
    )}
  </div>
);

};

export default AutoScrollGallery;

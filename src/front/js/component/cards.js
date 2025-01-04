import React, { useEffect, useState } from "react";
import "../../styles/cards.css";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const AutoScrollGallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

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
          throw new Error(errorData.message || "Unknown error occurred");
        }

        const eventsData = await response.json();

        // Ordenar eventos por fecha de evento (más cercana primero)
        const sortedEvents = eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Error occurred during fetch:", err.message);
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  return (
  <div className="container-fluid">
    <h1 className="mb-5 ml-4">Próximos Eventos</h1>
    {error ? (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    ) : (
      <div className="auto-scroll-gallery">
        {events.map((event) => (
          <div
            key={event.id}
            className="card text-decoration-none text-muted"
            onClick={() => handleCardClick(event.id)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {/* Imagen del evento */}
            <img
              src={event.flyer_img_url}
              className="card-img-top"
              alt={event.event_name}
              style={{ height: "300px", objectFit: "cover" }}
            />
            
            <div className="card-body d-flex flex-column justify-content-between">
  <div>
    {/* Título del evento */}
    <h5 className="card-title text-wrap">{event.event_name}</h5>
    {/* Descripción del evento */}
    <p className="card-text text-wrap">
      {event.description || "No description available"}
    </p>
  </div>
  {/* Fecha del evento */}
  <div
    style={{
      alignSelf: "flex-end", 
      backgroundColor: "#f8f9fa",
      padding: "5px 10px",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      marginTop: "10px", // Espacio con respecto al texto
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

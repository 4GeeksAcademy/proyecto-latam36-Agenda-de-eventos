import React, { useEffect, useState } from "react";
import "../../styles/cards.css"; 

const AutoScrollGallery = () => {
  const [events, setEvents] = useState([]); 
  const [error, setError] = useState(null); 

  // Definir la URL del backend usando variables de entorno o `window.location.hostname`
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("JWT token is missing. Please log in.");
        }

        const API_BASE_URL = `${backend}/api/events`;

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

        // Hacer solicitudes adicionales para obtener más imágenes con `?details=true`
        const detailedEvents = await Promise.all(
          eventsData.map(async (event) => {
            const detailsResponse = await fetch(
              `${backend}/api/events/${event.id}?details=true`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();
              return { ...event, additionalImages: detailsData.images || [] };
            } else {
              return { ...event, additionalImages: [] };
            }
          })
        );

        setEvents(detailedEvents);
      } catch (err) {
        console.error("Error occurred during fetch:", err.message);
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-5 ml-4">Eventos cerca de ti</h1>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="auto-scroll-gallery">
          {events.map((event) => (
            <div key={event.id} className="card text-decoration-none text-muted">
              <img
                src={event.flyer_img_url}
                className="card-img-top"
                alt={event.event_name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title text-wrap">{event.event_name}</h5>
                <p className="card-text text-wrap">
                  {event.description || "No description available"}
                </p>
                {/* Mostrar imágenes adicionales si están disponibles */}
                <div className="additional-images">
                  {event.additionalImages.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Additional image ${index}`}
                      style={{ width: "100px", height: "100px", margin: "5px", objectFit: "cover" }}
                    />
                  ))}
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

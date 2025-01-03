import React, { useEffect, useState } from "react";
import "../../styles/cards.css"; 

const AutoScrollGallery = () => {
  const [events, setEvents] = useState([]); 
  const [error, setError] = useState(null); 

 
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

        console.log("API Response Status:", response.status);
        console.log("API Response Headers:", response.headers);

        if (!response.ok) {
          const errorData = await response.json();
          console.log("API Error Details:", errorData);
          throw new Error(errorData.message || "Unknown error occurred");
        }

        const data = await response.json();
        console.log("Fetched Events Data:", data);
        setEvents(data);
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
            <a
              key={event.id}
              href="#"
              className="card text-decoration-none text-muted"
            >
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
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoScrollGallery;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../component/navbar";

const backend = process.env.BACKEND_URL;

const EventsDetails = () => {
  const { id } = useParams(); 
  const [eventDetails, setEventDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // ADMIN?
        const responseAdmin = await fetch(`${backend}/api/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const isAdminResponse = await responseAdmin.json();
        setIsAdmin(isAdminResponse.is_admin);

        // Detalles del evento
        const response = await fetch(`${backend}/api/events/2`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEventDetails(data);
        } else {
          console.error("Failed to fetch event details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!eventDetails) {
    return <div>Event not found.</div>;
  }

  const {
    event_name,
    description,
    date,
    location,
    price,
    category,
    organizer_name,
    media_files,
    contact_info,
    status,
  } = eventDetails;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          {/* Carousel con imágenes del evento */}
          <div className="col-md-8">
            <div id="eventCarousel" className="carousel slide event-card" data-bs-ride="carousel">
              <div className="carousel-inner">
                {media_files && media_files.length > 0 ? (
                  media_files.map((media, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""} event-image`}
                    >
                      <img
                        src={media.url}
                        alt={media.media_type}
                        className="d-block w-100"
                      />
                      <div className="event-date">
                        <div className="month">{new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase()}</div>
                        <div className="day">{new Date(date).getDate()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="carousel-item active event-image">
                    <img
                      src="https://placehold.co/600x400"
                      alt="Placeholder image"
                      className="d-block w-100"
                    />
                  </div>
                )}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="event-details">
              <h3>{event_name}</h3>
              <p>{description}</p>
            </div>
          </div>

          {/* Información del evento */}
          <div className="col-md-4">
            <div className="event-info">
              <h5>{location}</h5>
              <p><i className="fas fa-calendar-alt"></i> {new Date(date).toLocaleString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p className="price">FROM ${price}</p>
              <button className="btn btn-primary">Buscar tickets</button>
            </div>
            <div className="producer-info">
              <p>{organizer_name}</p>
              <p>Productor.</p>
            </div>
            {isAdmin && (
              <div className="admin-buttons mt-3">
                <button className="btn btn-success me-2">Aprobar</button>
                <button className="btn btn-danger">Rechazar</button>
              </div>
            )}
          </div>
        </div>

        {/* Información de contacto */}
        <div className="mt-5">
          <h4>Información de contacto</h4>
          {contact_info && contact_info.length > 0 ? (
            <ul>
              {contact_info.map((contact, index) => (
                <li key={index}>
                  <strong>{contact.contact_media}:</strong> {contact.contact_data}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay información de contacto disponible.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsDetails;
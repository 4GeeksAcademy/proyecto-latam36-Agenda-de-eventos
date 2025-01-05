import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../component/navbar";
import Modal from "../component/Modal";
import AutoScrollGallery from "../component/cards";
import Breadcrumbs from "../component/Breadcrumbs.jsx";


const backend = process.env.BACKEND_URL;

const EventsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [justification, setJustification] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Verificar si el usuario es admin
        const responseAdmin = await fetch(`${backend}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const isAdminResponse = await responseAdmin.json();
        setIsAdmin(isAdminResponse.is_admin);

        const response = await fetch(`${backend}/api/events/${id}?details=true`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [id, navigate]);

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const newStatus = modalAction === "approve" ? "approved" : "rejected";

      const response = await fetch(`${backend}/api/events/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          justification,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }

      setEventDetails((prev) => ({
        ...prev,
        status: newStatus,
        event_admin_msg: justification,
      }));

      setShowModal(false);
      setJustification("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalOpen = (action) => {
    setModalAction(action);
    setJustification(eventDetails.event_admin_msg || "");
    setShowModal(true);
  };

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
    ticket_price,
    category,
    age_classification,
    organizer_name,
    organizer_email,
    flyer_img_url,
    media_files,
    contact_info,
    status,
  } = eventDetails;

  return (
    <>
      <Navbar />
      <Breadcrumbs eventName={eventDetails?.event_name} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
          <div id="eventCarousel" className="carousel slide event-card" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* Primera imagen: flyer */}
              {flyer_img_url && (
                <div className="carousel-item active event-image">
                  <img
                    src={flyer_img_url}
                    alt="Event flyer"
                    className="d-block w-100"
                  />
                  <div className="event-date">
                    <div className="month">
                      {new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase()}
                    </div>
                    <div className="day">{new Date(date).getDate()}</div>
                  </div>
                </div>
              )}
              {/* Otras imágenes: media_files */}
              {media_files && media_files.length > 0 ? (
                media_files.map((media, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${!flyer_img_url && index === 0 ? "active" : ""} event-image`}
                  >
                    <img
                      src={media.url}
                      alt={media.media_type}
                      className="d-block w-100"
                    />
                    <div className="event-date">
                      <div className="month">
                        {new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase()}
                      </div>
                      <div className="day">{new Date(date).getDate()}</div>
                    </div>
                  </div>
                ))
              ) : (
                // Imagen placeholder si no hay media_files
                !flyer_img_url && (
                  <div className="carousel-item active event-image">
                    <img
                      src="https://placehold.co/600x400"
                      alt="Placeholder image"
                      className="d-block w-100"
                    />
                  </div>
                )
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

          <div className="col-md-4">
            <div className="event-info">
              <h5>{location}</h5>
              <p>
                <i className="fas fa-calendar-alt"></i>{" "}
                {new Date(date).toLocaleString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong>Categoria :</strong> {category}
              </p>
              <p>
                <strong>Clasificación :</strong> {age_classification}
              </p>
              <p className="price">$ {ticket_price}</p>
              <button className="btn btn-primary">Buscar tickets</button>
            </div>
            <div className="producer-info">
              <h4 className="fw-bold">Productor :</h4>
              <p>
                <strong>Nombre :</strong> {organizer_name}
              </p>
              <p>
                <strong>Email :</strong> {organizer_email}
              </p>
            </div>
            {isAdmin && (
              <div className="admin-buttons mt-3">
                {status === "approved" ? (
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleModalOpen("reject")}
                  >
                    Cambiar a Rechazado
                  </button>
                ) : status === "rejected" ? (
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleModalOpen("approve")}
                  >
                    Cambiar a Aprobado
                  </button>
                ) : (
                  <div className="d-flex justify-content-between gap-2">
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={() => handleModalOpen("approve")}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn btn-danger flex-grow-1"
                      onClick={() => handleModalOpen("reject")}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 mb-5">
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
      <AutoScrollGallery />

      {showModal && (
        <Modal
          title={modalAction === "approve" ? "Aprobar evento" : "Rechazar evento"}
          onClose={() => setShowModal(false)}
          onConfirm={handleStatusChange}
        >
          <div className="p-3">
            <div className="mb-4">
              <p className="mb-2">
                <strong>Justificación actual:</strong>
              </p>
              <div className="alert alert-secondary" role="alert">
                {eventDetails.event_admin_msg || "Sin justificación previa"}
              </div>
            </div>
            <div>
              <p className="mb-2">
                <strong>Nueva justificación:</strong>
              </p>
              <textarea
                className="form-control"
                rows="4"
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Escribe tu justificación aquí..."
              ></textarea>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EventsDetails;

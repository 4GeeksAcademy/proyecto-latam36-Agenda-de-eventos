import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../component/navbar";
import Modal from "../component/Modal";
import Filters from "../component/Filters";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getCategoryFilterKey = (category) => {
    const categoryMappings = {
      'Deportes': 'sportsAndWellness',
      'Fitness': 'sportsAndWellness',
      'Salud': 'sportsAndWellness',
      'Deportes extremos': 'sportsAndWellness',
      'Artes Marciales': 'sportsAndWellness',
      'Tecnología': 'technology',
      'Ciencia': 'technology',
      'Gastronomía': 'gastronomy',
      'Bebidas': 'gastronomy',
      'Música': 'entertainmentAndCulture',
      'Teatro': 'entertainmentAndCulture',
      'Danza': 'entertainmentAndCulture',
      'Cine': 'entertainmentAndCulture',
      'Arte': 'entertainmentAndCulture',
      'Eventos Literarios': 'entertainmentAndCulture',
      'Conferencias': 'educationalAndProfessional',
      'Talleres': 'educationalAndProfessional',
      'Seminarios': 'educationalAndProfessional',
      'Educación': 'educationalAndProfessional',
      'Negocios': 'educationalAndProfessional',
      'Eventos Familiares': 'socialAndCommunity',
      'Caridad': 'socialAndCommunity',
      'Voluntariado': 'socialAndCommunity',
      'Religión': 'socialAndCommunity',
      'Moda': 'fashionAndLifestyle',
      'Estilo de Vida': 'fashionAndLifestyle',
      'Festivales': 'festivalsAndFestivities',
      'Carnavales': 'festivalsAndFestivities',
      'Celebraciones': 'festivalsAndFestivities'
    };
    
    return categoryMappings[category] || null;
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // Check if user is admin only if logged in
        if (token) {
          const responseAdmin = await fetch(`${backend}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const isAdminResponse = await responseAdmin.json();
          setIsAdmin(isAdminResponse.is_admin);
        }

        const response = await fetch(`${backend}/api/events/${id}?details=true`);

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

// Función para manejar el clic en el botón de favoritos
const handleFavoriteToggle = async () => {
    if (!isLoggedIn) {
        navigate("/login");
        return;
    }

    const token = localStorage.getItem("token");
    const method = isFavorite ? "DELETE" : "POST";
    const url = `${backend}/api/favorite/${id}`;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al actualizar favoritos");
        }
        
        setIsFavorite(!isFavorite);
    } catch (error) {
        console.error(error);
    }
};

useEffect(() => {
    const checkFavoriteStatus = async () => {
        if (!isLoggedIn) return;

        const token = localStorage.getItem("token");
        const response = await fetch(`${backend}/api/user/favorite`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const favorites = await response.json();
            const isEventFavorite = favorites.some(fav => fav.event_id === id);
            setIsFavorite(isEventFavorite);
        }
    };

    checkFavoriteStatus();
}, [isLoggedIn, id]);



  const handleStatusChange = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
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
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setModalAction(action);
    setJustification(eventDetails?.event_admin_msg || "");
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
              {media_files && media_files.length > 0 && 
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
              }
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
              <strong>Categoria:</strong> {category}
            </p>
            <p>
              <strong>Clasificación:</strong> {age_classification}
            </p>
            <p className="price">$ {ticket_price}</p>
            
            {isLoggedIn ? (
              <button className="btn btn-primary w-100" onClick={handleFavoriteToggle}>
                  <i className={`fas fa-heart me-2 ${isFavorite ? 'text-danger' : ''}`}></i>
                  {isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
              </button>
            ) : (
              <div className="alert alert-info" role="alert">
                <p className="mb-2">¿Te interesa este evento? Inicia sesión para agregar a favoritos y acceder a más funciones.</p>
                <div className="d-flex gap-2">
                  <a href="/login" className="btn btn-primary btn-sm">
                    Iniciar sesión
                  </a>
                  <a href="/signup" className="btn btn-outline-primary btn-sm">
                    Registrarse
                  </a>
                </div>
              </div>
            )}
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
      {eventDetails && (
        <Filters 
          visibleFilters={[getCategoryFilterKey(eventDetails.category)].filter(Boolean)} title={`Explora más eventos de ${eventDetails.category}`}
        />
      )}

      {showModal && isLoggedIn && (
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

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../component/navbar";
import Modal from "../component/Modal";
import Filters from "../component/Filters";
import Breadcrumbs from "../component/Breadcrumbs.jsx";

const CATEGORY_MAPPINGS = {
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
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [error, setError] = useState(null);

  const getCategoryFilterKey = useCallback((category) => {
    return CATEGORY_MAPPINGS[category] || null;
  }, []);

  const fetchEventDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        const responseAdmin = await fetch(`${backend}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responseAdmin.ok) throw new Error('Failed to fetch admin status');
        const isAdminResponse = await responseAdmin.json();
        setIsAdmin(isAdminResponse.is_admin);
      }

      const response = await fetch(`${backend}/api/events/${id}?details=true`);
      if (!response.ok) throw new Error('Failed to fetch event details');
      
      const data = await response.json();
      setEventDetails(data);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const checkFavoriteStatus = useCallback(async () => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backend}/api/user/favorite`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch favorites');
      
      const data = await response.json();
      const favorites = data.favorites_event_id || [];
      const eventId = parseInt(id);
      const isEventFavorite = favorites.some(favId => parseInt(favId) === eventId);
      setIsFavorite(isEventFavorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [isLoggedIn, id]);

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    const method = isFavorite ? "DELETE" : "POST";
    
    try {
      const response = await fetch(`${backend}/api/favorite/${id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al actualizar favoritos");
      
      setIsFavorite(!isFavorite);
      const message = isFavorite ? "Eliminado de Favoritos" : "Agregado a Favoritos";
      setFavoriteMessage(message);
      setTimeout(() => setFavoriteMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setFavoriteMessage("Error al actualizar favoritos");
      setTimeout(() => setFavoriteMessage(""), 3000);
    }
  };

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

      if (!response.ok) throw new Error("Error al actualizar el estado del evento");

      setEventDetails(prev => ({
        ...prev,
        status: newStatus,
        event_admin_msg: justification,
      }));

      setShowModal(false);
      setJustification("");
    } catch (error) {
      console.error(error);
      setFavoriteMessage("Error al actualizar el estado");
      setTimeout(() => setFavoriteMessage(""), 3000);
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

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        {error}
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="alert alert-warning m-5" role="alert">
        Evento no encontrado.
      </div>
    );
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

  const renderCarouselItems = () => {
    const items = [];
    
    if (flyer_img_url) {
      items.push(
        <div key="flyer" className="carousel-item active event-image">
          <img src={flyer_img_url} alt="Event flyer" className="d-block w-100" />
          <div className="event-date">
            <div className="month">
              {new Date(date).toLocaleString("es-US", { month: "short" }).toUpperCase()}
            </div>
            <div className="day">{new Date(date).getDate()}</div>
          </div>
        </div>
      );
    }

    if (media_files?.length) {
      media_files.forEach((media, index) => {
        items.push(
          <div
            key={index}
            className={`carousel-item ${!flyer_img_url && index === 0 ? "active" : ""} event-image`}
          >
            <img src={media.url} alt={`Event media ${index + 1}`} className="d-block w-100" />
            <div className="event-date">
              <div className="month">
                {new Date(date).toLocaleString("en-US", { month: "short" }).toUpperCase()}
              </div>
              <div className="day">{new Date(date).getDate()}</div>
            </div>
          </div>
        );
      });
    }

    return items;
  };

  const renderAdminButtons = () => {
    if (!isAdmin) return null;

    if (status === "approved") {
      return (
        <button
          className="btn btn-danger w-100"
          onClick={() => handleModalOpen("reject")}
        >
          Cambiar a Rechazado
        </button>
      );
    }

    if (status === "rejected") {
      return (
        <button
          className="btn btn-success w-100"
          onClick={() => handleModalOpen("approve")}
        >
          Cambiar a Aprobado
        </button>
      );
    }

    return (
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
    );
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs eventName={event_name} />
      
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <div id="eventCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {renderCarouselItems()}
              </div>
              {(flyer_img_url || media_files?.length > 1) && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>

            <div className="event-details mt-4">
              <h3>{event_name}</h3>
              <p>{description}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="event-info card p-4 mb-4">
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
                <div>
                  <button 
                    className="btn button-fav w-100" 
                    onClick={handleFavoriteToggle}
                  >
                    <i className={`fas fa-heart me-2 ${isFavorite ? 'text-danger' : ''}`}></i>
                    {isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                  </button>
                  {favoriteMessage && (
                    <div className="alert alert-info mt-2">
                      {favoriteMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert alert-info bg-dark rounded-3" role="alert">
                  <p className="mb-2">¿Te interesa este evento? Inicia sesión para agregar a favoritos y acceder a más funciones.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <a href="/login" className="btn button-fav btn-sm">
                      Iniciar sesión
                    </a>
                    <a href="/signup" className="btn button-fav btn-sm">
                      Registrarse
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="producer-info card p-4 mb-4">
              <h4 className="fw-bold">Productor</h4>
              <p>
                <strong>Nombre:</strong> {organizer_name}
              </p>
              <p>
                <strong>Email:</strong> {organizer_email}
              </p>
            </div>

            {isAdmin && (
              <div className="admin-buttons mt-3">
                {renderAdminButtons()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 mb-5">
          <h4>Información de contacto</h4>
          {contact_info?.length > 0 ? (
            <ul className="list-unstyled">
              {contact_info.map((contact, index) => (
                <li key={index} className="mb-2">
                  <strong>{contact.contact_media}:</strong> {contact.contact_data}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">
              No hay información de contacto disponible.
            </p>
          )}
        </div>
      </div>

      {eventDetails && (
        <Filters 
          visibleFilters={[getCategoryFilterKey(eventDetails.category)].filter(Boolean)}
          title={`Explora más eventos de ${eventDetails.category}`}
        />
      )}
      <p className="text-muted"></p>
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
                value={justification}
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


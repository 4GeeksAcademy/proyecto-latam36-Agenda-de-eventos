import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/navbar";
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import "../../styles/perfil.css";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("perfil");
  const [userEvents, setUserEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL || `https://${window.location.hostname}:3001`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const profileResponse = await fetch(`${backend}/api/users/me`, { headers });
        if (!profileResponse.ok) throw new Error("Error al obtener el perfil");
        const userData = await profileResponse.json();
        setUser(userData);

        const favoritesResponse = await fetch(`${backend}/api/user/favorite`, { headers });
        if (!favoritesResponse.ok) throw new Error("Error al obtener favoritos");
        const favoritesData = await favoritesResponse.json();

        if (favoritesData.favorites_event_id && favoritesData.favorites_event_id.length > 0) {
          const favoriteEventsDetails = await Promise.all(
            favoritesData.favorites_event_id.map(async (eventId) => {
              try {
                const eventResponse = await fetch(`${backend}/api/events/${eventId}`, { headers });
                if (!eventResponse.ok) return null;
                return eventResponse.json();
              } catch (error) {
                console.error(`Error al obtener evento ${eventId}:`, error);
                return null;
              }
            })
          );
          setFavoriteEvents(favoriteEventsDetails.filter((event) => event !== null));
        }

        const eventsResponse = await fetch(`${backend}/api/events`, { headers });
        if (!eventsResponse.ok) throw new Error("Error al obtener eventos");
        const eventsData = await eventsResponse.json();
        const userOrganizedEvents = eventsData.filter((event) => event.organizer_id === userData.id);
        setUserEvents(userOrganizedEvents);
      } catch (err) {
        console.error("Error en fetchData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backend]);

  const handleRemoveFromFavorites = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backend}/api/favorite/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al eliminar de favoritos:", errorData.message);
        return;
      }

      setFavoriteEvents((prevFavorites) =>
        prevFavorites.filter((event) => event.id !== eventId)
      );
      alert("Evento eliminado de favoritos");
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
    }
  };

  const StatusOrRemoveButton = ({ status, onRemove }) => {
      const statusColors = {
        submitted: "bg-warning text-dark",
        approved: "bg-success text-white",
        rejected: "bg-danger text-white",
        cancelled: "bg-secondary text-white",
      };
  
      const statusTexts = {
        submitted: "Enviado",
        approved: "Aprobado",
        rejected: "Rechazado",
        cancelled: "Cancelado",
      };

    return onRemove ? (
      <button
        className="button-fav"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        Eliminar de Favoritos
      </button>
    ) : (
      <span className={`${statusColors[status]} text-white px-2 py-1 rounded text-xs font-medium`}>
        {statusTexts[status] || status}
      </span>
    );
  };

  const EventCard = ({ event, showStatus, onRemove }) => (
    <div
      className="card mb-3 d-flex flex-row align-items-center"
      onClick={() => navigate(`/EventsDetails/${event.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={event.flyer_img_url || "https://via.placeholder.com/100"}
        alt={event.event_name}
        className="card-img-left"
        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
      />
      <div className="card-body d-flex justify-content-between w-100">
        <div>
          <h5 className="card-title mb-1">{event.event_name}</h5>
          <p className="card-text text-muted mb-0">
            {new Date(event.date).toLocaleDateString("es-ES")}
          </p>
        </div>
        <div className="d-flex align-items-center">
          <StatusOrRemoveButton
            status={showStatus ? event.status : null}
            onRemove={onRemove ? () => onRemove(event.id) : null}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "perfil":
        return (
          <div className="card mb-5">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <p><strong>Nombre:</strong> {user?.first_name}</p>
                <p><strong>Apellido:</strong> {user?.last_name}</p>
                <p><strong>País:</strong> {user?.country}</p>
                <p><strong>Ciudad:</strong> {user?.city}</p>
                <p><strong>Fecha de Nacimiento:</strong> {user?.date_of_birth}</p>
              </div>
              <img
                src={user?.profile_image || "https://via.placeholder.com/150"}
                alt="Foto de perfil"
                className="rounded-circle ms-3"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
          </div>
        );
      case "Mis Eventos":
        return (
          <>
            <h4>Eventos Organizados</h4>
            {userEvents.length === 0 ? (
              <p>No has organizado ningún evento aún.</p>
            ) : (
              userEvents.map((event) => (
                <EventCard key={event.id} event={event} showStatus={true} />
              ))
            )}
          </>
        );
      case "Favoritos":
        return (
          <>
            <h4>Eventos Favoritos</h4>
            {favoriteEvents.length === 0 ? (
              <p>No tienes eventos favoritos.</p>
            ) : (
              favoriteEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showStatus={false}
                  onRemove={handleRemoveFromFavorites}
                />
              ))
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Navbar />
      <Breadcrumbs />
      <div className="container mt-5">
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "perfil" ? "active" : ""}`}
              onClick={() => setActiveTab("perfil")}
            >
              Perfil
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Mis Eventos" ? "active" : ""}`}
              onClick={() => setActiveTab("Mis Eventos")}
            >
              Mis Eventos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Favoritos" ? "active" : ""}`}
              onClick={() => setActiveTab("Favoritos")}
            >
              Favoritos
            </button>
          </li>
        </ul>
        {renderContent()}
      </div>
    </div>
  );
};

export default Perfil;

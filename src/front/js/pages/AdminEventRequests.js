import React, { useState, useEffect } from "react";
import Modal from "../component/Modal";
import Navbar from "../component/navbar";
import "../../styles/Admin.css";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("submitted");
  const [modalAction, setModalAction] = useState("");
  const backend = process.env.BACKEND_URL;

  const handleTokenExpired = () => {
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };
  
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${backend}/api/check-admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.is_admin);
        } else if (response.status === 401) {
          handleTokenExpired();
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al verificar si es admin:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backend}/api/events?status=${activeTab}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            handleTokenExpired();
          }
          throw new Error("Error al obtener los eventos");
        }
        const data = await response.json();
        setEventRequests(data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEvents();
  }, [activeTab, isAdmin]);

  const handleStatusChange = async (eventId) => {
    try {
      const endpoint = `${backend}/api/events/${eventId}/${modalAction}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ justification }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleTokenExpired();
          return;
        }
        throw new Error("Error al actualizar el evento");
      }

      setEventRequests((prev) => prev.filter((event) => event.id !== eventId));
      setShowModal(false);
      setJustification("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalOpen = (event, action) => {
    setSelectedEvent(event);
    setModalAction(action);
    setJustification(event.event_admin_msg || ""); 
    setShowModal(true);
  };

  const renderButtons = (event) => {
    switch (activeTab) {
      case "submitted":
        return (
          <div className="d-flex justify-content-between gap-2">
            <button
              className="btn btn-success flex-grow-1"
              onClick={() => handleModalOpen(event, "approve")}
            >
              Aprobar
            </button>
            <button
              className="btn btn-danger flex-grow-1"
              onClick={() => handleModalOpen(event, "reject")}
            >
              Rechazar
            </button>
          </div>
        );
      case "approved":
        return (
          <button
            className="btn btn-danger w-100"
            onClick={() => handleModalOpen(event, "reject")}
          >
            Cambiar a Rechazado
          </button>
        );
      case "rejected":
        return (
          <button
            className="btn btn-success w-100"
            onClick={() => handleModalOpen(event, "approve")}
          >
            Cambiar a Aprobado
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <p className="text-center mt-5">Cargando...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="container text-center mt-5">
        <h1>Acceso Denegado</h1>
        <a href="/" className="btn btn-primary mt-3 mb-3">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div id="admin-container" className="container mt-5">
          <h1 id="admin-title">Gestión de Eventos</h1>

          <div className="nav nav-tabs mb-4">
            <button
              className={`nav-link ${activeTab === "submitted" ? "active" : ""}`}
              onClick={() => setActiveTab("submitted")}
            >
              Pendientes
            </button>
            <button
              className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              Aprobados
            </button>
            <button
              className={`nav-link ${activeTab === "rejected" ? "active" : ""}`}
              onClick={() => setActiveTab("rejected")}
            >
              Rechazados
            </button>
          </div>

          <div id="admin-cards" className="row justify-content-center">
            {eventRequests.length === 0 ? (
              <div className="alert alert-info text-center">
                No hay eventos {" "}
                {activeTab === "submitted"
                  ? "pendientes"
                  : activeTab === "approved"
                  ? "aprobados"
                  : "rechazados"}
              </div>
            ) : (
              eventRequests.map((event) => (
                <div key={event.id} className="col-12 col-md-8 col-lg-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{event.event_name}</h5>
                      <p>
                        <strong>Descripción:</strong> {event.description}
                      </p>
                      <p>
                        <strong>Solicitante:</strong> {event.organizer_email}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {event.date}
                      </p>
                      <p>
                        <strong>Lugar:</strong> {event.location}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${event.price}
                      </p>
                      <p>
                        <strong>Categoría:</strong> {event.category}
                      </p>
                      {renderButtons(event)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <Modal
          title={modalAction === "approve" ? "Aprobar evento" : "Rechazar evento"}
          onClose={() => {
            setShowModal(false);
            setJustification("");
          }}
          onConfirm={() => handleStatusChange(selectedEvent.id)}
        >
          <div className="p-3">
            <div className="mb-4">
              <p className="mb-2">
                <strong>Justificación actual:</strong>
              </p>
              <div className="alert alert-secondary" role="alert">
                {selectedEvent.event_admin_msg || "Sin justificación previa"}
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
    </div>
  );
};

export default AdminEventRequests;
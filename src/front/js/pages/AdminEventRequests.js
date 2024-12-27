import React, { useState, useEffect } from "react";
import Modal from "../component/Modal";
import Navbar from "../component/navbar";
import "../../styles/Admin.css";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submitted");
  const backend = process.env.BACKEND_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backend}/api/events?status=${activeTab}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener los eventos");
        const data = await response.json();
        setEventRequests(data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const handleStatusChange = (eventId, newStatus) => {
    if (newStatus === "rejected" && justification.trim() === "") {
      alert("Por favor ingresa una justificación");
      return;
    }

    fetch(`${backend}/api/events/${eventId}/${newStatus === "approved" ? "approve" : "reject"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ 
        event_reject_msg: justification || undefined,
        status: newStatus
      }),
    })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        setShowDetailsModal(false);
        setJustification("");
      })
      .catch((err) => console.error(err));
  };

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setJustification(event.event_reject_msg || "");
    setShowDetailsModal(true);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setJustification("");
  };

  return (
    <>
      <Navbar />
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
          {isLoading ? (
            <p className="text-center">Cargando...</p>
          ) : eventRequests.length === 0 ? (
            <div className="alert alert-info text-center">
              No hay eventos {activeTab === "submitted" ? "pendientes" : 
                           activeTab === "approved" ? "aprobados" : "rechazados"}
            </div>
          ) : (
            eventRequests.map((event) => (
              <div key={event.id} className="col-12 col-md-8 col-lg-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{event.event_name}</h5>
                    <p className="text-muted mb-3">{event.description}</p>
                    <p><strong>Solicitante:</strong> {event.organizer_email}</p>
                    <p><strong>Fecha:</strong> {formatDateTime(event.date)}</p>
                    <p><strong>Lugar:</strong> {event.location}</p>
                    <p><strong>Precio:</strong> ${event.price || 'Gratis'}</p>
                    <p><strong>Categoría:</strong> {event.category}</p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleShowDetails(event)}
                    >
                      Ver justificación y gestionar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de justificación y gestión */}
      {showDetailsModal && (
        <Modal
          title={`Gestionar Evento: ${selectedEvent.event_name}`}
          onClose={handleCloseModal}
          onConfirm={() => {}} // Añadido para evitar el error de prop type
          hideConfirmButton // Asegura que el botón confirmar no se muestre
        >
          <div className="p-3">
            {activeTab !== "submitted" && selectedEvent.event_reject_msg && (
              <div className="mb-4">
                <h6>Última justificación:</h6>
                <p className="border rounded p-3 bg-light">
                  {selectedEvent.event_reject_msg}
                </p>
              </div>
            )}

            {(activeTab !== "submitted" || activeTab === "submitted") && (
              <div className="mb-4">
                <h6>Nueva justificación:</h6>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Escribe la justificación para el cambio de estado..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                ></textarea>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              {activeTab === "submitted" ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusChange(selectedEvent.id, "approved")}
                  >
                    Aprobar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (justification.trim() === "") {
                        alert("Por favor ingresa una justificación");
                        return;
                      }
                      handleStatusChange(selectedEvent.id, "rejected");
                    }}
                  >
                    Rechazar
                  </button>
                </>
              ) : activeTab === "approved" ? (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (justification.trim() === "") {
                      alert("Por favor ingresa una justificación");
                      return;
                    }
                    handleStatusChange(selectedEvent.id, "rejected");
                  }}
                >
                  Cambiar a Rechazado
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    if (justification.trim() === "") {
                      alert("Por favor ingresa una justificación");
                      return;
                    }
                    handleStatusChange(selectedEvent.id, "approved");
                  }}
                >
                  Cambiar a Aprobado
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminEventRequests;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "../component/Modal";
import Navbar from "../component/navbar";
import "../../styles/Admin.css";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState({
    submitted: [],
    approved: [],
    rejected: []
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");
  const [activeTab, setActiveTab] = useState("submitted");
  const [modalAction, setModalAction] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const navigate = useNavigate();
  const backend = process.env.BACKEND_URL;

  const fetchEvents = useCallback(async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setTabLoading(true);
      const response = await fetch(`${backend}/api/events?status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener los eventos");
      }

      const data = await response.json();
      setEventRequests(prev => ({
        ...prev,
        [status]: data
      }));
    } catch (err) {
      console.error("Error al cargar eventos:", err);
    } finally {
      setTabLoading(false);
    }
  }, [backend, navigate]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${backend}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error verificando permisos");
        }

        const userData = await response.json();
        setIsAdmin(userData.is_admin || false);
        
        if (userData.is_admin) {
          await Promise.all([fetchEvents("submitted"), fetchEvents("approved"), fetchEvents("rejected")]);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate, fetchEvents, backend]);

  const handleStatusChange = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const newStatus = modalAction === "approve" ? "approved" : "rejected";

      const response = await fetch(`${backend}/api/events/${eventId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          justification 
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el evento");
      }

      const updatedEvent = { ...selectedEvent, status: newStatus, event_admin_msg: justification };
      
      setEventRequests(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(event => event.id !== eventId),
        [newStatus]: [...prev[newStatus], updatedEvent]
      }));

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
            <button className="btn btn-success flex-grow-1" onClick={() => handleModalOpen(event, "approve")}>
              Aprobar
            </button>
            <button className="btn btn-danger flex-grow-1" onClick={() => handleModalOpen(event, "reject")}>
              Rechazar
            </button>
          </div>
        );
      case "approved":
        return (
          <button className="btn btn-danger w-100" onClick={() => handleModalOpen(event, "reject")}>
            Cambiar a Rechazado
          </button>
        );
      case "rejected":
        return (
          <button className="btn btn-success w-100" onClick={() => handleModalOpen(event, "approve")}>
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
            {["submitted", "approved", "rejected"].map(tab => (
              <button key={tab} className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} disabled={tabLoading}>
                {tab === "submitted" ? "Pendientes" : tab === "approved" ? "Aprobados" : "Rechazados"}
              </button>
            ))}
          </div>

          <div id="admin-cards" className="row justify-content-center">
            {tabLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : eventRequests[activeTab].length === 0 ? (
              <div className="alert alert-info text-center">
                No hay eventos {activeTab === "submitted" ? "pendientes" : activeTab === "approved" ? "aprobados" : "rechazados"}
              </div>
            ) : (
              eventRequests[activeTab].map((event) => (
                <div key={event.id} className="col-12 col-md-8 col-lg-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/EventsDetails/${event.id}`} className="text-decoration-none">
                          {event.event_name}
                        </Link>
                      </h5>
                      <p><strong>Descripción:</strong> {event.description}</p>
                      <p><strong>Solicitante:</strong> {event.organizer_email}</p>
                      <p><strong>Fecha:</strong> {event.date}</p>
                      <p><strong>Lugar:</strong> {event.location}</p>
                      <p><strong>Precio:</strong> ${event.ticket_price}</p>
                      <p><strong>Categoría:</strong> {event.category}</p>
                      <p><strong>Clasificación:</strong> {event.age_classification}</p>
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
        <Modal title={modalAction === "approve" ? "Aprobar evento" : "Rechazar evento"} onClose={() => setShowModal(false)} onConfirm={() => handleStatusChange(selectedEvent.id)}>
          <div className="p-3">
            <div className="mb-4">
              <p className="mb-2"><strong>Justificación actual:</strong></p>
              <div className="alert alert-secondary" role="alert">{selectedEvent.event_admin_msg || "Sin justificación previa"}</div>
            </div>
            <div>
              <p className="mb-2"><strong>Nueva justificación:</strong></p>
              <textarea className="form-control" rows="4" onChange={(e) => setJustification(e.target.value)} placeholder="Escribe tu justificación aquí..."></textarea>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminEventRequests;

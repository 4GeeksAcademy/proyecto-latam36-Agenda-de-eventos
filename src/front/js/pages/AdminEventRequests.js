import React, { useState, useEffect } from "react";
import Modal from "../component/Modal";
import Navbar from "../component/navbar";
import "../../styles/Admin.css";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false); // Modal de confirmación
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const backend = process.env.BACKEND_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backend}/api/events?status=submitted`, {
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
  }, []);

  const handleApprove = (eventId) => {
    fetch(`${backend}/api/events/${eventId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        setShowApproveModal(false);
      })
      .catch((err) => console.error(err));
  };

  const handleReject = (eventId) => {
    if (justification.trim() === "") {
      alert("Por favor ingresa una justificación");
      return;
    }
    fetch(`${backend}/api/events/${eventId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ justification }),
    })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        setShowModal(false);
        setJustification("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Navbar />
      <div id="admin-container" className="container mt-5">
        <h1 id="admin-title">Solicitudes de Aprobación de Eventos</h1>
        <div id="admin-cards" className="row justify-content-center">
          {isLoading ? (
            <p className="text-center">Cargando...</p>
          ) : eventRequests.length === 0 ? (
            <div className="alert alert-info text-center">No hay solicitudes pendientes</div>
          ) : (
            eventRequests.map((event) => (
              <div key={event.id} className="col-12 col-md-8 col-lg-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{event.event_name}</h5>
                    <p><strong>Solicitante:</strong> {event.organizer_email}</p>
                    <p><strong>Fecha:</strong> {event.date}</p>
                    <p><strong>Lugar:</strong> {event.location}</p>
                    <p><strong>Precio:</strong> ${event.price}</p>
                    <p><strong>Categoría:</strong> {event.category}</p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowApproveModal(true);
                        }}
                      >
                        Aprobar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowModal(true);
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para justificar el rechazo */}
      {showModal && (
        <Modal
          title="Justificación para Rechazar"
          onClose={() => setShowModal(false)}
          onConfirm={() => handleReject(selectedEvent.id)}
        >
          <textarea
            className="form-control"
            rows="4"
            placeholder="Escribe la justificación aquí..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          ></textarea>
        </Modal>
      )}

      {/* Modal de confirmación para aprobar */}
      {showApproveModal && (
        <Modal
          title="Confirmación de Aprobación"
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => handleApprove(selectedEvent.id)}
        >
          <p>¿Estás seguro de que quieres aprobar este evento?</p>
        </Modal>
      )}
    </>
  );
};

export default AdminEventRequests;

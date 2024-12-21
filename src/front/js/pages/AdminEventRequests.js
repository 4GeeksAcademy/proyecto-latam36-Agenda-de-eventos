import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");

  const backend=process.env.BACKEND_URL

  // Simula obtener solicitudes del backend
  useEffect(() => {
    fetch("/api/events?status=submitted")
      .then((response) => response.json())
      .then((data) => setEventRequests(data))
      .catch((err) => console.error(err));
  }, []);

  // Verificar si es admin (check FrontEnd)
  const is_Admin = true; // Cambia esto por tu lógica real
  if (!is_Admin) {
    return <h1>Acceso denegado</h1>;
  }

  const handleApprove = (eventId) => {
    // Lógica para aprobar
    fetch(backend+`/api/events/${eventId}/approve`, {
      method: "PUT",
    })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
      })
      .catch((err) => console.error(err));
  };

  const handleReject = (eventId) => {
    if (justification.trim() === "") {
      alert("Por favor ingresa una justificación");
      return;
    }
    fetch(`/api/events/${eventId}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    <div className="container mt-5">
      <h1>Solicitudes de Aprobación de Eventos</h1>
      <table className="table table-bordered table-striped mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Nombre del Evento</th>
            <th>Solicitante</th>
            <th>Fecha</th>
            <th>Lugar</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventRequests.map((event) => (
            <tr key={event.id} onClick={() => alert("Ir al detalle del evento")}>
              <td>{event.name}</td>
              <td>{event.requestedBy}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>${event.price}</td>
              <td>{event.category}</td>
              <td>
                <button
                  className="btn btn-success btn-sm mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(event.id);
                  }}
                >
                  Aprobar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setShowModal(true);
                  }}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para justificar el rechazo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Justificación para Rechazar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Escribe la justificación aquí..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleReject(selectedEvent.id)}
          >
            Rechazar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEventRequests;

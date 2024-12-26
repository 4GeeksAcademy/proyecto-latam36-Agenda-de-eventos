import React, { useState, useEffect } from "react";
import Modal from "../component/Modal";
import Navbar from "../component/navbar";

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [justification, setJustification] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const backend = process.env.BACKEND_URL;
  const token = localStorage.getItem("token"); // Extraemos el token aquí

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        if (!token) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const resp = await fetch(`${backend}/api/check-admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (resp.ok) {
          const data = await resp.json();
          setIsAdmin(data.is_admin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error verificando rol de admin:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin === true) {
      fetch(`${backend}/api/events?status=submitted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error al obtener los eventos");
          return response.json();
        })
        .then((data) => setEventRequests(data))
        .catch((err) => console.error("Error al cargar eventos:", err));
    }
  }, [isAdmin]);

  const handleApprove = (eventId) => {
    fetch(`${backend}/api/events/${eventId}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al aprobar el evento");
        return response.json();
      })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
      })
      .catch((err) => console.error("Error al aprobar el evento:", err));
  };

  const handleReject = (eventId) => {
    if (justification.trim() === "") {
      alert("Por favor ingresa una justificación");
      return;
    }
    fetch(`${backend}/api/events/${eventId}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ justification }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al rechazar el evento");
        return response.json();
      })
      .then(() => {
        setEventRequests((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        setShowModal(false);
        setJustification("");
      })
      .catch((err) => console.error("Error al rechazar el evento:", err));
  };
  

  if (isLoading) {
    return <h1>Cargando...</h1>;
  }

  if (!isAdmin) {
    return (
      <div className="container text-center mt-5">
        <h1>Acceso denegado</h1>
        <div className="d-flex flex-column align-items-center mt-3 mb-3">
          <a href="/" className="btn btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>

    );
  }

  return (
    <>
      <Navbar /> 
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
                <td>{event.event_name}</td>
                <td>{event.organizer_email}</td>
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
      </div>
    </>
  );
};

export default AdminEventRequests;

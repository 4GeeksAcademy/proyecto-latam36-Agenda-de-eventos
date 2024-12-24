import React, { useEffect, useState } from 'react';
import Navbar from "../component/navbar";


const backend = process.env.BACKEND_URL;

const EventsDetails = () => {
  const [isAdmin, setIsAdmin] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [eventRequests, setEventRequests] = useState([]);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        console.log("Verifying admin status...");
        const isAdmin = await actions.checkAdmin();
        console.log("Admin status:", isAdmin);
        setIsAdmin(isAdmin);
        if (!isAdmin) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching event requests...");
        fetch(`${backend}/api/events?status=submitted`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Event requests data:", data);
            setEventRequests(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error verifying admin:", error);
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <div id="eventCarousel" className="carousel slide event-card" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active event-image">
                  <img
                    src="https://placehold.co/600x400"
                    alt="Ladies Night Party Poster with neon pink text on a dark blue background"
                    className="d-block w-100"
                  />
                  <div className="event-date">
                    <div className="month">DEC</div>
                    <div className="day">13</div>
                  </div>
                </div>
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
              <h3>Ladies Night</h3>
              <p>Bonaventure Golf Club - Bonaventure 19th</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="event-info">
              <h5>Bonaventure Golf Club - Bonaventure 19th</h5>
              <p>Bonaventure 19th</p>
              <p><i className="fas fa-calendar-alt"></i> Friday 13 December, 07:00 PM</p>
              <p className="price">FROM $50.00</p>
              <button className="btn btn-primary">Buscar tickets</button>
            </div>
            <div className="producer-info">
              <p>Tyko Productions</p>
              <p>Productor.</p>
            </div>
            {isAdmin && (
              <div className="admin-buttons mt-3">
                <button className="btn btn-success me-2">Aprobar</button>
                <button className="btn btn-danger">Rechazar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EventsDetails;

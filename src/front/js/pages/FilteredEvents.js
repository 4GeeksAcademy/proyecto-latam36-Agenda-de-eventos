import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import EventFilters from "../component/EventFilters";
import { filtersConfig } from "../component/Filters";
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import Navbar from "../component/navbar";
import "../../styles/FilteredEvents.css";

const FilteredEvents = () => {
  const { store } = useContext(Context);
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [breadcrumbsTitle, setBreadcrumbsTitle] = useState(filtersConfig[category]?.title || "Todos");
  const [isOnline, setIsOnline] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [ageClassification, setAgeClassification] = useState("Todos");
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const categories = filtersConfig[category]?.filter?.category.split(", ") || [];

  const handleCardClick = (eventId) => {
    navigate(`/EventsDetails/${eventId}`);
  };

  const fetchFilteredEvents = async (queryCategories) => {
    try {
      const queryParams = new URLSearchParams();
      if (queryCategories.length > 0) {
        queryCategories.forEach(cat => queryParams.append("category", cat));
      }
      queryParams.append("status", "approved");
      if (isOnline !== null) queryParams.append("is_online", isOnline);
      if (selectedPrice !== "Todos") queryParams.append("price_type", selectedPrice.toLowerCase() === "gratis" ? "free" : "paid");
      if (ageClassification !== "Todos") queryParams.append("age_classification", ageClassification);
  
      const response = await fetch(`${process.env.BACKEND_URL}/api/events?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: store.token ? `Bearer ${store.token}` : undefined,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
  
      const events = await response.json();
      
      const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
      const groupedEvents = sortedEvents.reduce((acc, event) => {
        if (event.status === "approved") {
          const eventCategories = event.category.split(', ');
          eventCategories.forEach(cat => {
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(event);
          });
        }
        return acc;
      }, {});
  
      setFilteredEvents(groupedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (initialLoad) {
      fetchFilteredEvents(categories);
      setInitialLoad(false);
    }
  }, [initialLoad, categories]);

  useEffect(() => {
    if (!initialLoad) {
      fetchFilteredEvents(selectedCategory === "" || selectedCategory === "Todos" ? [] : [selectedCategory]);
      setBreadcrumbsTitle(selectedCategory !== "" && selectedCategory !== "Todos" ? selectedCategory : filtersConfig[category]?.title || "Todos");
    }
  }, [selectedCategory, isOnline, selectedPrice, ageClassification, store.token]);

  return (
    <>
      <Navbar />
      <Breadcrumbs eventName={breadcrumbsTitle} />

      <div className="filtered-events-page">
        <h2>Eventos en la categoría: {breadcrumbsTitle}</h2>
        <EventFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          ageClassification={ageClassification}
          setAgeClassification={setAgeClassification}
        />
        <div className="events-grid">
          {error ? (
            <p>Error al cargar los eventos: {error}</p>
          ) : Object.keys(filteredEvents).length > 0 ? (
            Object.entries(filteredEvents).map(([cat, events]) => (
              <div key={cat} className={`category-section ${selectedCategory === cat ? 'selected-category' : ''}`}>
                <h3>{cat}</h3>
                <div className="events-cards">
                  {events.slice(0, selectedCategory === cat ? 15 : 5).map((event) => (
                    <div 
                      className="event-card" 
                      key={event.id}
                      onClick={() => handleCardClick(event.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          event.flyer_img_url ||
                          "https://via.placeholder.com/800x400?text=No+Image"
                        }
                        alt={event.event_name}
                      />
                      <div className="event-info">
                        <h3>{event.event_name}</h3>
                        <div className="date-display">
                          <div className="date-month">
                            {new Date(event.date).toLocaleString("default", { month: "short" }).toUpperCase()}
                          </div>
                          <div className="date-day">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="date-time">
                            {new Date(event.date).toLocaleString("default", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
                {events.length > 5 && selectedCategory !== cat && (
                  <button 
                    className="see-more-button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setInitialLoad(false); 
                      setBreadcrumbsTitle(cat); 
                    }}
                  >
                    Ver más
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay eventos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FilteredEvents;
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import EventFilters from "../component/EventFilters";
import { filtersConfig } from "../component/Filters";
import Breadcrumbs from "../component/Breadcrumbs.jsx";
import Navbar from "../component/navbar";
import "../../styles/FilteredEvents.css";

const FilteredEvents = () => {
  const { store } = useContext(Context);
  const { category } = useParams();
  const [filteredEvents, setFilteredEvents] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isOnline, setIsOnline] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [ageClassification, setAgeClassification] = useState("Todos");
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true); // Para manejar la carga inicial

  // Obtener las categorías desde el filterKey
  const categories = filtersConfig[category]?.filter?.category.split(", ") || [];

  const fetchFilteredEvents = async (queryCategories) => {
    try {
      const queryParams = new URLSearchParams();
      queryCategories.forEach(cat => queryParams.append("category", cat));
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

      // Agrupar eventos por categoría
      const groupedEvents = events.reduce((acc, event) => {
        const eventCategories = event.category.split(', ');
        eventCategories.forEach(cat => {
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(event);
        });
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
      fetchFilteredEvents([selectedCategory]);
    }
  }, [selectedCategory, isOnline, selectedPrice, ageClassification, store.token]);

  return (
    <>
      <Navbar />
      <Breadcrumbs />

    <div className="filtered-events-page">
      <h2>Eventos en la categoría: {filtersConfig[category]?.title || "Todos"}</h2>
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
            <div key={cat} className="category-section">
              <h3>{cat}</h3>
              <div className="events-cards">
                {events.slice(0, 5).map((event) => (
                  <div className="event-card" key={event.id}>
                    <img
                      src={
                        event.flyer_img_url ||
                        "https://via.placeholder.com/800x400?text=No+Image"
                      }
                      alt={event.event_name}
                    />
                    <div className="event-info">
                      <h3>{event.event_name}</h3>
                      <p>{new Date(event.event_date).toLocaleDateString("es-ES")}</p>
                    </div>
                  </div>
                ))}
              </div>
              {events.length > 5 && (
                <button 
                  className="see-more-button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setInitialLoad(false); // Asegurar que no se ejecute la carga inicial nuevamente
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

import React from "react";
import "../../styles/EventFilters.css";

const EventFilters = ({ selectedCategory, setSelectedCategory, isOnline, setIsOnline, selectedPrice, setSelectedPrice, ageClassification, setAgeClassification }) => {
  const categories = ["Todos", "Deportivos", "Música", "Espiritualidad", "Gastronomía y Bebida", "Artes Visuales y Escénicas", "Familia y Educación", "Negocios", "Caridad y Causas Benéficas", "Académicos", "Moda"];
  const eventTypes = ["Todos", "Online", "Presencial"];
  const priceTypes = ["Todos", "De Pago", "Gratis"];
  const ageTypes = ["Todos", "Todo Público", "18+"];

  return (
    <div className="event-filters mb-3 p-3">
      <div className="event-filters__selects">
        <div className="event-filters__event-type-select">
          <label htmlFor="event-type-select" className="event-filters__form-label">Tipo de Evento:</label>
          <select 
            id="event-type-select" 
            className="event-filters__form-select" 
            value={isOnline === null ? "Todos" : isOnline ? "Online" : "Presencial"} 
            onChange={(e) => {
              const value = e.target.value;
              setIsOnline(value === "Todos" ? null : value === "Online");
            }}
          >
            <option disabled value="">Seleccionar tipo</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="event-filters__price-select">
          <label htmlFor="price-select" className="event-filters__form-label">Valor del Evento:</label>
          <select 
            id="price-select" 
            className="event-filters__form-select" 
            value={selectedPrice || "Todos"} 
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option disabled value="">Seleccionar valor</option>
            {priceTypes.map((priceType) => (
              <option key={priceType} value={priceType}>{priceType}</option>
            ))}
          </select>
        </div>
        <div className="event-filters__age-select">
          <label htmlFor="age-select" className="event-filters__form-label">Clasificación por Edad:</label>
          <select 
            id="age-select" 
            className="event-filters__form-select" 
            value={ageClassification || "Todos"} 
            onChange={(e) => setAgeClassification(e.target.value)}
          >
            <option disabled value="">Seleccionar edad</option>
            {ageTypes.map((ageType) => (
              <option key={ageType} value={ageType}>{ageType}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="event-filters__tabs">
        {categories.map((category) => (
          <button 
            key={category} 
            className={`event-filters__tab ${selectedCategory === category ? 'active' : ''}`} 
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventFilters;

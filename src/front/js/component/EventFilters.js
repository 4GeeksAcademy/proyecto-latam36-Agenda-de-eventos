import React from "react";
import "../../styles/EventFilters.css";

const EventFilters = ({ selectedCountry, setSelectedCountry, selectedCategory, setSelectedCategory, isOnline, setIsOnline, selectedPrice, setSelectedPrice }) => {
  const countries = ["Todos", "Argentina", "Mexico", "Colombia"];
  const categories = ["Todos", "Deportivos", "Música", "Espiritualidad", "Gastronomía y Bebida", "Artes Visuales y Escénicas", "Familia y Educación", "Negocios", "Caridad y Causas Benéficas", "Académicos", "Moda"];
  const eventTypes = ["Todos", "Online", "Presencial"];
  const priceTypes = ["Todos", "De Pago", "Gratis"];

  return (
    <div className="event-filters mb-3 p-3">
      <div className="event-filters__selects">
        <div className="event-filters__country-select">
          <label htmlFor="country-select" className="event-filters__form-label">País:</label>
          <select 
            id="country-select" 
            className="event-filters__form-select" 
            value={selectedCountry || ""} 
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option disabled value="">Seleccionar país</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
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

import React, { useState } from "react";
import "../../styles/EventFilters.css";

const EventFilters = ({ 
  selectedCategory, 
  setSelectedCategory, 
  isOnline, 
  setIsOnline, 
  selectedPrice, 
  setSelectedPrice, 
  ageClassification, 
  setAgeClassification 
}) => {
  const categoryGroups = {
    sportsAndWellness: {
      title: "Deportes y Bienestar",
      categories: ["Deportes", "Fitness y Salud", "Deportes extremos", "Artes Marciales"]
    },
    technology: {
      title: "Tecnología y Ciencias",
      categories: ["Tecnología", "Ciencia"]
    },
    gastronomy: {
      title: "Gastronomía y Bebidas",
      categories: ["Gastronomía", "Bebidas"]
    },
    entertainmentAndCulture: {
      title: "Entretenimiento y Cultura",
      categories: ["Música", "Teatro y Danza", "Cine", "Arte y Exposiciones", "Literarios"]
    },
    educationalAndProfessional: {
      title: "Educativos y Profesionales",
      categories: ["Conferencias", "Talleres y Seminarios", "Educación y Aprendizaje", "Negocios y Emprendimiento"]
    },
    socialAndCommunity: {
      title: "Social y Comunitario",
      categories: ["Familiares", "Caridad y Voluntariado", "Religión y Espiritualidad"]
    },
    fashionAndLifestyle: {
      title: "Moda y Estilo de Vida",
      categories: ["Moda", "Estilo de Vida"]
    },
    festivalsAndFestivities: {
      title: "Fiestas y Festividades",
      categories: ["Festivales y Carnavales", "Celebraciones"]
    }
  };

  const eventTypes = ["Todos", "Online", "Presencial"];
  const priceTypes = ["Todos", "De Pago", "Gratis"];
  const ageTypes = ["Todo Público", "13+", "16+", "18+", "Infantiles", "Adultos Mayores"];

  return (
    <div className="event-filters mb-3 p-3">
      <div className="event-filters__selects">
        <div className="event-filters__event-type-select">
          <label htmlFor="event-type-select">Tipo de Evento</label>
          <select 
            id="event-type-select"
            className="form-select" 
            value={isOnline === null ? "Todos" : isOnline ? "Online" : "Presencial"} 
            onChange={(e) => {
              const value = e.target.value;
              setIsOnline(value === "Todos" ? null : value === "Online");
            }}
          >
            <option disabled value="">Tipo de Evento</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="event-filters__price-select">
          <label htmlFor="price-select">Valor del Evento</label>
          <select 
            id="price-select"
            className="form-select"
            value={selectedPrice || "Todos"} 
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option disabled value="">Valor del Evento</option>
            {priceTypes.map((priceType) => (
              <option key={priceType} value={priceType}>{priceType}</option>
            ))}
          </select>
        </div>

        <div className="event-filters__age-select">
          <label htmlFor="age-select">Clasificación por Edad</label>
          <select 
            id="age-select"
            className="form-select"
            value={ageClassification || "Todos"} 
            onChange={(e) => setAgeClassification(e.target.value)}
          >
            <option disabled value="">Clasificación por Edad</option>
            {ageTypes.map((ageType) => (
              <option key={ageType} value={ageType}>{ageType}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="event-filters__category-select">
        <label htmlFor="category-select">Categoría</label>
        <select 
          id="category-select"
          className="form-select"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>Seleccionar Categoría</option>
          <option value="Ver todos">Ver todos</option>
          {Object.entries(categoryGroups).map(([groupKey, group]) => (
            <optgroup key={groupKey} label={group.title}>
              {group.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilters;

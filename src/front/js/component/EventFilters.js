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
          <select 
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
          <select 
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
          <select 
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

      <div className="event-filters__category-selects">
        {Object.entries(categoryGroups).map(([groupKey, group]) => (
          <div key={groupKey} className="event-filters__category-group">
            <select 
              className="form-select"
              value={group.categories.includes(selectedCategory) ? selectedCategory : ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>{group.title}</option>
              <option value={groupKey}>Ver todos</option>
              {group.categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventFilters;

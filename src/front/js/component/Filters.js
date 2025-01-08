import React, { useContext } from "react";
import AutoScrollGallery from "../component/cards";
import { Context } from "../store/appContext";

const Filters = ({ visibleFilters = [] }) => {
  const { store } = useContext(Context);

  // Filtros predefinidos
  const filtersConfig = {
    sportsAndWellness: {
      title: "Deportes y Bienestar",
      filter: {
        category: "Deportes, Fitness y Salud, Deportes extremos, Artes Marciales",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    technology: {
      title: "Tecnología y Ciencias",
      filter: {
        category: "Tecnología, Ciencia",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    gastronomy: {
      title: "Gastronomía y Bebidas",
      filter: {
        category: "Gastronomía, Bebidas",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
  };

  return (
    <div className="filters-page">
      <h2>Explora Eventos por Categorías</h2>
      {visibleFilters.map((filterKey) => {
        const { title, filter } = filtersConfig[filterKey] || {};
        return (
          title && (
            <div key={filterKey} className="scroll-gallery mt-5">
              <h3>{title}</h3>
              <AutoScrollGallery filters={filter} />
            </div>
          )
        );
      })}
    </div>
  );
};

export default Filters;

import React, { useContext } from "react";
import AutoScrollGallery from "../component/cards";
import { Context } from "../store/appContext";

const Filters = ({ visibleFilters = [], title = "Explora Eventos por Categorías" }) => {
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
    entertainmentAndCulture: {
      title: "Entretenimiento y Cultura",
      filter: {
        category: "Música, Teatro y Danza, Cine, Arte y Exposiciones, Eventos Literarios",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    educationalAndProfessional: {
      title: "Educativos y Profesionales",
      filter: {
        category: "Conferencias, Talleres y Seminarios, Educación y Aprendizaje, Negocios y Emprendimiento",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    socialAndCommunity: {
      title: "Social y Comunitario",
      filter: {
        category: "Eventos Familiares, Caridad y Voluntariado, Religión y Espiritualidad",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    fashionAndLifestyle: {
      title: "Moda y Estilo de Vida",
      filter: {
        category: "Moda, Estilo de Vida",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
    festivalsAndFestivities: {
      title: "Fiestas y Festividades",
      filter: {
        category: "Festivales y Carnavales, Celebraciones",
        isOnline: null,
        price: "Todos",
        ageClassification: "Todos",
      },
    },
  };

  return (
    <div className="filters-page">
      <h2>{title}</h2>
      {visibleFilters.map((filterKey) => {
        const { title: sectionTitle, filter } = filtersConfig[filterKey] || {};
        return (
          sectionTitle && (
            <div key={filterKey} className="scroll-gallery">
              <h3>{sectionTitle}</h3>
              <AutoScrollGallery filters={filter} />
            </div>
          )
        );
      })}
    </div>
  );
};

export default Filters;

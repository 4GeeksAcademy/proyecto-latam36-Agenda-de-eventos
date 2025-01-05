import React, { useState } from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";

//componentes
import Navbar from "../component/navbar";
import AutoScrollGallery from "../component/cards";
import EventFilters from "../component/EventFilters";

function Home() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isOnline, setIsOnline] = useState(null);

  const filters = {
    country: selectedCountry,
    category: selectedCategory,
    isOnline: isOnline,
  };

  return (
    <>
      <main className="principal mb-3">
        <Navbar />
        <section className="principal__banner">
          <div className="principal__evento">
            <img
              className="slogan-png"
              src="https://res.cloudinary.com/dijfzjssm/image/upload/v1734509652/BOCETOS_INTERFAZ_ANDREINA-10_aqzcje.png"
              alt="texto"
            />
          </div>
          <div className="principal__crearEvento">
            <div className="principal__crearEvento__texto">
              <p>Publica tu evento</p>
              <Link to={"/EventsForm"}>
                <button className="boton-1">Crear tu evento</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <EventFilters
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
      />

      <div className="scroll-gallery mt-5">
        <AutoScrollGallery filters={filters} /> {/* Pasamos los filtros seleccionados como props */}
      </div>
    </>
  );
}

export default Home;

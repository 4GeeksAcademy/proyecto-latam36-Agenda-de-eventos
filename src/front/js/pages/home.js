import React from "react";
import Navbar from "../component/navbar";
import Carrusel from "../component/Carrusel";
import Filters from "../component/Filters";
import { useAuthModal } from '../../../utils/authUtils';
import AuthRequired from "../component/AuthRequired";
import "../../styles/home.css";

function Home() {
  const { isModalOpen, handleAuthAction, closeModal } = useAuthModal('/EventsForm');
  const authTitleProps = { page: 'EventsForm' };

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
              <p className="parrafo-publica">
                Publica
                <br />
                tu evento
              </p>
              <button className="boton-1" onClick={handleAuthAction}>
                Crea tu evento
              </button>
            </div>
          </div>
        </section>
      </main>
      <Carrusel />
      <Filters
        visibleFilters={[
          "sportsAndWellness",
          "technology",
          "gastronomy",
          "entertainmentAndCulture",
          "educationalAndProfessional",
          "socialAndCommunity",
          "fashionAndLifestyle",
          "festivalsAndFestivities",
        ]}
        title={`Explora eventos por Categorías`}
      />
      {isModalOpen && <AuthRequired onClose={closeModal} authTitleProps={authTitleProps} />}
    </>
  );
}

export default Home;
import React from "react";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import Navbar from "../component/navbar";
import Filters from "../component/Filters";

function Home() {
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

      <Filters />
    </>
  );
}

export default Home;
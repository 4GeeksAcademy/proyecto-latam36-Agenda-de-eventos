import React from 'react';
import { Link } from "react-router-dom";
import "../../styles/jumbotron.css";

const Jumbotron = () => {
    return(
        <div id="home-jumbotron-container" className="col-12 col-sm-6 col-lg-6 p-5 d-flex">
            <div className="jumbotron-fluid container-fluid p-5 bg-light rounded-2">
                <h1 className="display-4">Bienvenidos amantes de la cultura!</h1>
                <p className="lead">Cultural Wave, tu plataforma Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, ullam assumenda maxime et aliquid sapiente perspiciatis consequatur magni cumque, dignissimos iusto quo distinctio deserunt itaque odit exercitationem.</p>
            </div>
            <div>
                <Link to={"/EventsForm"} className="btn ">
                Crear tu evento
            </Link>
            </div>
        </div>
    );
};


export default Jumbotron